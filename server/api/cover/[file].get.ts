// /server/api/cover/[file].get.ts
import { parseFile } from 'music-metadata'
import path from 'path'
import { serverSupabaseClient } from '#supabase/server'

const MUSIC_DIR = path.resolve(process.cwd(), 'public/uploads/music')
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
    const metadata = await parseFile(filePath)
    const picture = metadata.common.picture?.[0]
    if (!picture) throw createError({ statusCode: 404, statusMessage: 'No cover found' })

    // Save to cache
    coverCache.set(file, { data: picture.data, format: picture.format })

    return new Response(picture.data, {
        headers: {
            'Content-Type': picture.format,
            'Cache-Control': 'public, max-age=86400, immutable'
        }
    })
})
