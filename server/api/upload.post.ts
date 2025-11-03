// server/api/upload.post.ts
import { defineEventHandler, readMultipartFormData, getRequestHeaders } from 'h3'
import { extname } from 'path'
import { serverSupabaseClient } from '#supabase/server'
import { getStore } from '@netlify/blobs'
import { parseBuffer } from 'music-metadata'

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

        const blobStore = getStore({
            name: 'music-files',
            // siteID: process.env.NETLIFY_SITE_ID,
            // token: process.env.NETLIFY_AUTH_TOKEN,
        })

        type UploadResult = { file: string; data: unknown }
        type UploadError = { file: string; message: string; stack?: string }
        const results: UploadResult[] = []
        const errors: UploadError[] = []

        for (const file of files) {
            const filename = String(file.filename)
            const ext = extname(filename).toLowerCase()
            const mime = file.type?.toLowerCase() || ''
            const musicExts = ['.mp3', '.wav', '.flac', '.aac', '.ogg']

            if (!(mime.startsWith('audio') || musicExts.includes(ext))) {
                console.warn(`Skipping unsupported file type: ${filename}`)
                continue
            }

            try {
                // Step 1: Upload to Netlify Blobstore
                const uint8 = new Uint8Array(file.data as Buffer)
                const arrayBuffer: ArrayBuffer = uint8.slice().buffer
                await blobStore.set(
                    filename,
                    new Blob([arrayBuffer], { type: mime || 'audio/mpeg' }),
                    {
                        metadata: {
                            contentType: mime || 'audio/mpeg',
                            uploadedAt: new Date().toISOString(),
                        },
                    }
                )
                console.log('✅ Uploaded to blobstore:', filename)

                // Step 2: Parse metadata locally (avoid internal HTTP call)
                let parsedTitle: string | null = null
                let parsedArtist: string | null = null
                let parsedAlbum: string | null = null
                // Optional: artwork could be extracted if needed in future
                try {
                    const mm = await parseBuffer(Buffer.from(file.data as Buffer))
                    parsedTitle = mm.common.title ?? null
                    parsedArtist = mm.common.artist ?? null
                    parsedAlbum = mm.common.album ?? null
                } catch (metaErr) {
                    console.warn(`⚠️ Metadata parse failed for ${filename}:`, metaErr)
                }

                // Step 3: Insert into Supabase
                const userId = getRequestHeaders(event)['x-user-id'] ?? user.id
                const { data, error } = await client
                    .from('music')
                    .insert({
                        file: filename,
                        title: parsedTitle || filename,
                        artist: parsedArtist || null,
                        album: parsedAlbum || null,
                        user_id: userId,
                    })
                    .select()
                    .single()

                if (error) {
                    type DbError = { code?: string }
                    const dbError = error as DbError
                    if (dbError.code === '23505') {
                        console.warn(`⚠️ Duplicate file skipped: ${filename}`)
                        continue
                    }
                    throw error
                }

                results.push({ file: filename, data })
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error'
                const stack = err instanceof Error ? err.stack : undefined
                console.error(`❌ Error processing ${filename}:`, err)
                errors.push({
                    file: filename,
                    message,
                    stack,
                })
            }
        }

        return { uploaded: results, errors }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('❌ Server-level error:', err)
        return { error: 'Something went wrong on the server', details: message }
    }
})
