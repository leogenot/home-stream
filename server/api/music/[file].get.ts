// server/api/music/[file].get.ts
import { defineEventHandler, sendStream, createError, getHeader, setHeader } from 'h3'
import { join } from 'path'
import { createReadStream, existsSync, statSync } from 'fs'

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
        const stat = statSync(filePath)
        const fileSize = stat.size
        const range = getHeader(event, 'range')

        // Set content type based on file extension
        const ext = file.toLowerCase().split('.').pop()
        const contentType = ext === 'mp3' ? 'audio/mpeg' :
            ext === 'wav' ? 'audio/wav' :
                ext === 'ogg' ? 'audio/ogg' :
                    ext === 'flac' ? 'audio/flac' :
                        ext === 'm4a' ? 'audio/mp4' :
                            'audio/mpeg'

        setHeader(event, 'Content-Type', contentType)
        setHeader(event, 'Accept-Ranges', 'bytes')

        if (range) {
            // Parse range header (e.g., "bytes=0-1023")
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0] || '0', 10)
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
            const chunksize = (end - start) + 1

            // Set partial content headers
            setHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`)
            setHeader(event, 'Content-Length', chunksize)

            // Set 206 Partial Content status
            event.node.res.statusCode = 206

            return sendStream(event, createReadStream(filePath, { start, end }))
        } else {
            // No range requested, send entire file
            setHeader(event, 'Content-Length', fileSize)
            return sendStream(event, createReadStream(filePath))
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        throw createError({
            statusCode: 500,
            statusMessage: `Error reading file: ${message}`
        })
    }
})
