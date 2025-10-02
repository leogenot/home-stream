// server/api/music/[file].get.ts
import { defineEventHandler, sendStream } from 'h3'
import { join } from 'path'
import { createReadStream } from 'fs'

export default defineEventHandler(async (event) => {
    const file = decodeURIComponent(event.context.params?.file || '')
    if (!file) return { error: 'No file' }

    const filePath = join(process.cwd(), 'storage', 'uploads', 'music', file)
    console.log('decoded file', file, 'normal file', event.context.params?.file)
    return sendStream(event, createReadStream(filePath))
})
