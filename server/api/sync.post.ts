import { defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data: { user }, error: userError } = await client.auth.getUser()
  if (userError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'User not authenticated' })
  }

  // Note: The sync functionality is not compatible with Netlify Blobs storage
  // as it requires local file system access to read directory contents.
  // With Netlify Blobs, files must be uploaded through the /api/upload endpoint.
  throw createError({ 
    statusCode: 501, 
    statusMessage: 'Sync functionality is not available with Netlify Blobs storage. Please use the upload endpoint instead.' 
  })
})


