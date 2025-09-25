// /server/api/cover/[file].get.ts
import { parseFile } from 'music-metadata'
import { defineEventHandler, createError } from 'h3'
import path from 'path'

const MUSIC_DIR = path.resolve(process.cwd(), 'public/uploads/music')

export default defineEventHandler(async (event) => {
    const rawFile = event.context.params?.file
    if (!rawFile) throw createError({ statusCode: 400, statusMessage: 'Missing file' })

    const file = decodeURIComponent(rawFile)
    const filePath = path.join(MUSIC_DIR, file)

    const metadata = await parseFile(filePath)

    const picture = metadata.common.picture?.[0]
    if (!picture) throw createError({ statusCode: 404, statusMessage: 'No cover found' })

    return new Response(picture.data, {
        headers: { 'Content-Type': picture.format }
    })
})
