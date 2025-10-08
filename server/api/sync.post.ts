import { defineEventHandler, getRequestHeaders, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { readdir, stat } from 'fs/promises'
import path, { extname } from 'path'
import { parseFile } from 'music-metadata'

const MUSIC_DIR = path.resolve(process.cwd(), 'storage/uploads/music')
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.flac', '.aac', '.ogg'])

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data: { user }, error: userError } = await client.auth.getUser()
  if (userError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'User not authenticated' })
  }

  // Ensure directory exists and is readable
  let entries: string[] = []
  try {
    entries = await readdir(MUSIC_DIR)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown error'
    throw createError({ statusCode: 500, statusMessage: `Unable to read uploads directory: ${message}` })
  }

  const results: Array<{ file: string; status: 'inserted' | 'skipped' | 'failed'; reason?: string }> = []

  for (const entry of entries) {
    try {
      const filePath = path.join(MUSIC_DIR, entry)
      const st = await stat(filePath)
      if (!st.isFile()) {
        continue
      }

      const ext = extname(entry).toLowerCase()
      if (!AUDIO_EXTS.has(ext)) {
        continue
      }

      // Check if this file already exists for this user
      const { data: existing, error: selectError } = await client
        .from('music')
        .select('id')
        .eq('file', entry)
        .eq('user_id', user.id)
        .maybeSingle()

      if (selectError) {
        throw selectError
      }

      if (existing) {
        results.push({ file: entry, status: 'skipped', reason: 'already in database' })
        continue
      }

      // Parse metadata directly from file
      let title: string | null = null
      let artist: string | null = null
      let album: string | null = null
      try {
        const metadata = await parseFile(filePath)
        title = metadata.common.title ?? null
        artist = metadata.common.artist ?? null
        album = metadata.common.album ?? null
      } catch (e) {
        // Continue with filename as title if metadata parsing fails
      }

      const { error: insertError } = await client
        .from('music')
        .insert({
          file: entry,
          title: title || entry,
          artist: artist || null,
          album: album || null,
          user_id: user.id,
        })

      if (insertError) {
        // If unique violation, mark skipped; else, mark failed
        if ('code' in insertError && insertError.code === '23505') {
          results.push({ file: entry, status: 'skipped', reason: 'duplicate' })
        } else {
          results.push({ file: entry, status: 'failed', reason: insertError.message })
        }
        continue
      }

      results.push({ file: entry, status: 'inserted' })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'unknown error'
      results.push({ file: entry, status: 'failed', reason: message })
    }
  }

  const summary = {
    inserted: results.filter(r => r.status === 'inserted').length,
    skipped: results.filter(r => r.status === 'skipped').length,
    failed: results.filter(r => r.status === 'failed').length,
  }

  return { summary, results }
})


