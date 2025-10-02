// /server/api/cover/[file].get.ts
import { parseFile } from 'music-metadata'
import path from 'path'
import { existsSync } from 'fs'
import { serverSupabaseClient } from '#supabase/server'

const MUSIC_DIR = path.resolve(process.cwd(), 'storage/uploads/music')
const coverCache = new Map<string, { data: Buffer; format: string }>()

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()
    if (userError || !user) {
        throw createError({ statusCode: 401, statusMessage: 'User not authenticated' })
    }

    const rawFile = event.context.params?.file
    if (!rawFile) throw createError({ statusCode: 400, statusMessage: 'Missing file' })

    const file = decodeURIComponent(rawFile)

    // If cached, return immediately
    if (coverCache.has(file)) {
        const cached = coverCache.get(file)!
        return new Response(cached.data, {
            headers: {
                'Content-Type': cached.format,
                'Cache-Control': 'public, max-age=86400, immutable'
            }
        })
    }

    const filePath = path.join(MUSIC_DIR, file)
    console.log('Cover request for file:', file, 'full path:', filePath)

    // Check if file exists before trying to parse metadata
    if (!existsSync(filePath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `Music file not found: ${file}`
        })
    }

    try {
        const metadata = await parseFile(filePath)
        const picture = metadata.common.picture?.[0]
        if (!picture) throw createError({ statusCode: 404, statusMessage: 'No cover found in file' })

        // Save to cache
        coverCache.set(file, { data: picture.data, format: picture.format })

        return new Response(picture.data, {
            headers: {
                'Content-Type': picture.format,
                'Cache-Control': 'public, max-age=86400, immutable'
            }
        })
    } catch (error: any) {
        // Handle metadata parsing errors
        if (error.statusCode) {
            // Re-throw createError instances
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: `Error parsing file metadata: ${error.message}`
        })
    }
})
