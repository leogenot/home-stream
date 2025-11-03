import { parseBuffer } from 'music-metadata'
import { defineEventHandler, getQuery, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { getStore } from '@netlify/blobs'

export default defineEventHandler(async (event) => {
    // Check authentication
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()

    if (userError || !user) {
        throw createError({ statusCode: 401, statusMessage: 'User not authenticated' })
    }

    const { file } = getQuery(event)

    if (!file || typeof file !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Missing file parameter' })
    }

    const safeFile = decodeURIComponent(file)

    try {
        // Initialize Netlify Blobs store
        const blobStore = getStore({
            name: 'music-files',
            // siteID: process.env.NETLIFY_SITE_ID,
            // token: process.env.NETLIFY_AUTH_TOKEN,
        })

        // Get file from Netlify Blobs
        const fileData = await blobStore.get(safeFile, { type: 'arrayBuffer' })

        if (!fileData) {
            throw createError({
                statusCode: 404,
                statusMessage: `Music file not found: ${safeFile}`
            })
        }

        const metadata = await parseBuffer(Buffer.from(fileData))

        let pictureBase64: string | null = null
        if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0]
            pictureBase64 = `data:${picture.format};base64,${picture.data.toString('base64')}`
        }

        return {
            title: metadata.common.title ?? null,
            artist: metadata.common.artist ?? null,
            album: metadata.common.album ?? null,
            picture: pictureBase64,
            duration: metadata.format.duration ?? null,
        }
    } catch (err: any) {
        // Re-throw createError instances
        if (err.statusCode) {
            throw err
        }
        throw createError({ statusCode: 500, statusMessage: `Metadata parse failed: ${err.message}` })
    }
})
