// server/api/upload.post.ts
import { defineEventHandler, readMultipartFormData } from 'h3'
import { join, extname } from 'path'
import { writeFile } from 'fs/promises'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event)
    if (!files || !files.length) {
        return { error: 'No file found' }
    }

    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()
    console.log('user.id', user.id)
    if (userError || !user) {
        return { error: 'User not authenticated' }
    }


    const results: any[] = []

    for (const file of files) {
        const filePath = join(process.cwd(), 'public', 'uploads', file.filename as string)

        // Save file to disk
        await writeFile(filePath, file.data)

        // Detect type
        const ext = extname(file.filename).toLowerCase()
        const mime = file.type?.toLowerCase() || ''

        const musicExts = ['.mp3', '.wav', '.flac', '.aac', '.ogg']
        const movieExts = ['.mp4', '.mkv', '.avi', '.mov', '.wmv']

        let tableToInsert: 'music' | 'movies' | null = null

        if (mime.startsWith('audio') || musicExts.includes(ext)) {
            tableToInsert = 'music'
        } else if (mime.startsWith('video') || movieExts.includes(ext)) {
            tableToInsert = 'movies'
        } else {
            // Skip unknown file types
            continue
        }

        // Insert into correct table
        try {
            const { data, error } = await client
                .from(tableToInsert)
                .insert({
                    file: file.filename,
                    user_id: user?.id,
                })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') { // Postgres unique violation (thanks chat)
                    console.log(`File ${file.filename} already exists, skipping insert`);
                    continue;
                }
                throw error;
            }
            results.push({ table: tableToInsert, ...data });
        } catch (err) {
            console.error(err);
        }


    }

    return { files: results }
})
