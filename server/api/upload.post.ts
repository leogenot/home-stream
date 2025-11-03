// server/api/upload.post.ts
import { defineEventHandler, readMultipartFormData, getHeaders, getRequestHeaders, getRequestURL } from 'h3'
import { extname } from 'path'
import { serverSupabaseClient } from '#supabase/server'
import { $fetch } from 'ofetch'
import { getStore } from '@netlify/blobs'

export default defineEventHandler(async (event) => {
    try {
        const files = await readMultipartFormData(event)
        console.log(files)
        if (!files || !files.length) {
            return { error: 'No file found' }
        }

        const client = await serverSupabaseClient(event)
        const { data: { user }, error: userError } = await client.auth.getUser()

        if (userError || !user) {
            return { error: 'User not authenticated' }
        }

        // Initialize Netlify Blobs store
        const blobStore = getStore({
            name: 'music-files',
            siteID: process.env.NETLIFY_SITE_ID,
            token: process.env.NETLIFY_AUTH_TOKEN,
        })

        const results: any[] = []
        for (const file of files) {
            const ext = extname(file.filename as string).toLowerCase()
            const mime = file.type?.toLowerCase() || ''
            const musicExts = ['.mp3', '.wav', '.flac', '.aac', '.ogg']

            let tableToInsert: 'music' | null = null
            if (mime.startsWith('audio') || musicExts.includes(ext)) {
                tableToInsert = 'music'
            } else {
                continue // Skip unknown file types
            }

            try {
                // Store file in Netlify Blobs
                await blobStore.set(file.filename as string, file.data, {
                    metadata: {
                        contentType: mime || 'audio/mpeg',
                        uploadedAt: new Date().toISOString(),
                    },
                })

                const reqUrl = getRequestURL(event)
                const origin = `${reqUrl.protocol}//${reqUrl.host}`
                const headers = getRequestHeaders(event)
                const metadata = await $fetch(`${origin}/api/metadata`, {
                    method: 'GET',
                    query: { file: file.filename as string },
                    headers: { cookie: headers.cookie || '' },
                }) as { title: string | null; artist: string | null; album: string | null; picture: string | null }

                const { data, error } = await client
                    .from(tableToInsert)
                    .insert({
                        file: file.filename,
                        title: metadata.title || file.filename,
                        artist: metadata.artist || null,
                        album: metadata.album || null,
                        user_id: getHeaders(event)['x-user-id'] || user.id,
                    })
                    .select()
                    .single()

                if (error) {
                    if (error.code === '23505') {
                        // File already exists, skip insert
                        continue
                    }
                    throw error
                }

                results.push({ table: tableToInsert, ...data })
            } catch (err) {
                // Error processing file
            }
        }
        return { files: results }
    }
    catch (err) {
        return { error: 'Something went wrong on the server' }
    }

})
