import { defineEventHandler, send } from 'h3'
import { join } from 'path'
import { createReadStream } from 'fs'

export default defineEventHandler(async (event) => {
    if (event.node.req.url?.startsWith('/uploads/')) {
        const filePath = join(process.cwd(), 'uploads', event.node.req.url.replace('/uploads/', ''))
        return send(event, createReadStream(filePath))
    }
})
