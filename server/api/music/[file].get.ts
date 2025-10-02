// server/api/music/[file].get.ts
import { defineEventHandler, sendStream, createError } from 'h3'
import { join } from 'path'
import { createReadStream, existsSync } from 'fs'

export default defineEventHandler(async (event) => {
    const rawFile = event.context.params?.file || ''
    if (!rawFile) {
        throw createError({ statusCode: 400, statusMessage: 'No file specified' })
    }

    // Handle potential double URL encoding
    let file = decodeURIComponent(rawFile)

    // If the decoded string still contains URL-encoded characters, decode again
    if (file.includes('%')) {
        try {
            file = decodeURIComponent(file)
        } catch {
            // If second decode fails, use the first decoded version
            console.warn('Failed to double-decode filename:', file)
        }
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
