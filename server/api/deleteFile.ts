import { defineEventHandler, readBody } from 'h3'
import { join } from 'path'
import { unlink } from 'fs/promises'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const { filename, table } = await readBody(event) as { filename: string, table: 'music' }
    if (!filename || !table) return { error: 'fileId and table are required' }
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()
    if (userError || !user) return { error: 'User not authenticated' }

    try {
        // Fetch file info from DB
        const { data, error } = await client
            .from(table)
            .select('file')
            .eq('file', filename)
            .eq('user_id', user.id)
            .single()

        console.log('filename', filename, data)
        if (error || !data) return { error: 'File not found' }


        const filePath = join(process.cwd(), 'uploads', 'music', data.file!)

        // Delete file from disk
        await unlink(filePath)

        // Delete file from Supabase
        await client.from(table).delete().eq('file', filename)

        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Failed to delete file' }
    }
})
