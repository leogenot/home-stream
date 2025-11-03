import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { getStore } from '@netlify/blobs'

export default defineEventHandler(async (event) => {
    const { file, table } = await readBody(event) as { file: string, table: 'music' }
    if (!file || !table) return { error: 'filename and table are required' }
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()
    if (userError || !user) return { error: 'User not authenticated' }

    try {
        // Fetch file info from DB
        const { data, error } = await client
            .from(table)
            .select('file')
            .eq('file', file)
            .eq('user_id', user.id)
            .single()

        if (error || !data) return { error: 'File not found' }

        // Initialize Netlify Blobs store
        const blobStore = getStore({
            name: 'music-files',
            siteID: process.env.NETLIFY_SITE_ID,
            token: process.env.NETLIFY_AUTH_TOKEN,
        })

        // Delete file from Netlify Blobs
        await blobStore.delete(data.file)

        // Delete file from Supabase
        await client.from(table).delete().eq('file', file)

        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Failed to delete file' }
    }
})
