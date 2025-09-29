// server/api/upload.post.ts
import { defineEventHandler, readMultipartFormData } from 'h3'
import { join, dirname, extname } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try {
        const files = await readMultipartFormData(event)
        if (!files || !files.length) {
            return { error: 'No file found' }
        }

        const client = await serverSupabaseClient(event)
        const { data: { user }, error: userError } = await client.auth.getUser()

        if (userError || !user) {
            return { error: 'User not authenticated' }
        }

        const results: any[] = []
        for (const file of files) {
            const filePath = join(process.cwd(), 'public', 'uploads', 'music', file.filename as string)

            await mkdir(dirname(filePath), { recursive: true })

            await writeFile(filePath, file.data)

            const ext = extname(file.filename).toLowerCase()
            const mime = file.type?.toLowerCase() || ''
            const musicExts = ['.mp3', '.wav', '.flac', '.aac', '.ogg']

            let tableToInsert: 'music' | null = null
            if (mime.startsWith('audio') || musicExts.includes(ext)) {
                tableToInsert = 'music'
            } else {
                continue // Skip unknown file types
            }

            try {
                const { data, error } = await client
                    .from(tableToInsert)
                    .insert({
                        title: file.filename,
                        user_id: getHeaders(event)['x-user-id'] || user.id,
                    })
                    .select()
                    .single()

                if (error) {
                    if (error.code === '23505') {
                        console.log(`File ${file.filename} already exists, skipping insert`)
                        continue
                    }
                    throw error
                }
                results.push({ table: tableToInsert, ...data })
            } catch (err) {
                console.error(err)
            }
        }
        return { files: results }
    }
    catch (err) {
        console.error('Handler crashed:', err)
        return { error: 'Something went wrong on the server' }
    }

})
