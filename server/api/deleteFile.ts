import { defineEventHandler, readBody } from 'h3'
import { join } from 'path'
import { unlink } from 'fs/promises'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const { file, table } = await readBody(event) as { file: string, table: 'music' }
    console.log('deleting - ', file, ' from ', table)
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

        console.log('file', file, data)
        if (error || !data) return { error: 'File not found' }

        const filePath = join(process.cwd(), 'storage', 'uploads', 'music', data.file)

        // Delete file from disk
        await unlink(filePath)

        // Delete file from Supabase
        await client.from(table).delete().eq('file', file)

        return { success: true }
    } catch (err: any) {
        return { error: err.message || 'Failed to delete file' }
    }
})
