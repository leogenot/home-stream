// /server/api/cover/[file].get.ts
import { parseBuffer } from 'music-metadata'
import { serverSupabaseClient } from '#supabase/server'
import { setHeader, createError } from 'h3'
import { getStore } from '@netlify/blobs'

const coverCache = new Map<string, { data: Uint8Array; format: string }>()

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()
    if (userError || !user) {
        throw createError({ statusCode: 401, statusMessage: 'User not authenticated' })
    }

    const rawFile = event.context.params?.file
    if (!rawFile) throw createError({ statusCode: 400, statusMessage: 'Missing file' })

    // Handle potential double URL encoding
    let file = decodeURIComponent(rawFile)

    // If the decoded string still contains URL-encoded characters, decode again
    if (file.includes('%')) {
        try {
            file = decodeURIComponent(file)
        } catch {
            // If second decode fails, use the first decoded version
        }
    }

    // If cached, return immediately
    if (coverCache.has(file)) {
        const cached = coverCache.get(file)!
        setHeader(event, 'Content-Type', cached.format)
        setHeader(event, 'Cache-Control', 'public, max-age=86400, immutable')
        return cached.data
    }

    try {
        // Initialize Netlify Blobs store
        const blobStore = getStore({
            name: 'music-files',
            // siteID: process.env.NETLIFY_SITE_ID,
            // token: process.env.NETLIFY_AUTH_TOKEN,
        })

        // Get file from Netlify Blobs
        const fileData = await blobStore.get(file, { type: 'arrayBuffer' })

        if (!fileData) {
            throw createError({
                statusCode: 404,
                statusMessage: `Music file not found: ${file}`
            })
        }

        const metadata = await parseBuffer(Buffer.from(fileData))
        const picture = metadata.common.picture?.[0]
        if (!picture) throw createError({ statusCode: 404, statusMessage: 'No cover found in file' })

        // Save to cache
        coverCache.set(file, { data: picture.data, format: picture.format })

        setHeader(event, 'Content-Type', picture.format)
        setHeader(event, 'Cache-Control', 'public, max-age=86400, immutable')
        return picture.data
    } catch (error: unknown) {
        // Handle metadata parsing errors
        if (error && typeof error === 'object' && 'statusCode' in error) {
            // Re-throw createError instances
            throw error
        }
        const message = error instanceof Error ? error.message : 'Unknown error'
        throw createError({
            statusCode: 500,
            statusMessage: `Error parsing file metadata: ${message}`
        })
    }
})
