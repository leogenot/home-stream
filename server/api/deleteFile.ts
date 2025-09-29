import { defineEventHandler, readBody } from 'h3'
import { join } from 'path'
import { unlink } from 'fs/promises'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const { title, table } = await readBody(event) as { title: string, table: 'music' }
    if (!title || !table) return { error: 'fileId and table are required' }
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()
    if (userError || !user) return { error: 'User not authenticated' }

    try {
        // Fetch file info from DB
        const { data, error } = await client
            .from(table)
            .select('title')
            .eq('title', title)
            .eq('user_id', user.id)
            .single()

        console.log('title', title, data)
        if (error || !data) return { error: 'File not found' }

        const filePath = join(process.cwd(), 'public', 'uploads', 'music', data.title)

        // Delete file from disk
        await unlink(filePath)

        // Delete file from Supabase
        await client.from(table).delete().eq('title', title)

        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Failed to delete file' }
    }
})
