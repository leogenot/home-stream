// server/api/music/[file].get.ts
import { defineEventHandler, sendStream, createError } from 'h3'
import { join } from 'path'
import { createReadStream, existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    const file = decodeURIComponent(event.context.params?.file || '')
    if (!file) {
        throw createError({ statusCode: 400, statusMessage: 'No file specified' })
    }

    const filePath = join(process.cwd(), 'storage', 'uploads', 'music', file)
    console.log('decoded file', file, 'normal file', event.context.params?.file)
    console.log('full file path', filePath)

    // Check if file exists before trying to create read stream
    if (!existsSync(filePath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `File not found: ${file}`
        })
    }

    try {
        return sendStream(event, createReadStream(filePath))
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Error reading file: ${error.message}`
        })
    }
})
