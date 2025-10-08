import { useSupabaseClient } from '#imports'

const USER_STORAGE_KEY = 'stream-user'

const PAGE_SIZE = 100

export type Album = {
  name: string
  artist: string
  songs: Song[]
  coverUrl?: string
}

export default function useAlbums() {
  const supabase = useSupabaseClient()

  const userData = useState<User | undefined | null>('userData', () => null)
  const _error = ref<string | null>(null)

  // fetch user from localStorage
  onMounted(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      try {
        userData.value = JSON.parse(stored)
      } catch (e) {
        // Failed to parse user from localStorage
      }
    }
  })

  const albums = ref<Album[]>([])
  const albumMap = new Map<string, Album>()
  const hasMore = ref(true)
  const isLoading = ref(false)
  const currentPage = ref(0)

  const fetchAlbums = async (reset = false) => {
    if (!userData.value || !userData.value?.auth_user_id) return
    if (isLoading.value || (!hasMore.value && !reset)) return

    isLoading.value = true

    if (reset) {
      currentPage.value = 0
      albumMap.clear()
      albums.value = []
      hasMore.value = true
    }

    const from = currentPage.value * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('music')
      .select('id, title, file, artist, album, created_at')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error || !data) {
      isLoading.value = false
      return
    }

    // Group songs by album
    for (const song of data) {
      const albumKey = `${song.album} - ${song.artist}`

      if (!albumMap.has(albumKey)) {
        albumMap.set(albumKey, {
          name: song.album,
          artist: song.artist,
          songs: [],
          coverUrl: undefined
        })
      }

      albumMap.get(albumKey)!.songs.push(song)
    }

    // Convert to array and get cover URLs
    const albumList = Array.from(albumMap.values())

    // Try to get cover from the first song of each album
    for (const album of albumList) {
      if (album.songs.length > 0 && !album.coverUrl) {
        const firstSong = album.songs[0]
        try {
          album.coverUrl = `/api/cover/${encodeURIComponent(firstSong.file)}`
        } catch (e) {
          // Failed to get cover for album
        }
      }
    }

    albums.value = albumList
    hasMore.value = data.length === PAGE_SIZE
    currentPage.value++
    isLoading.value = false
  }

  const loadMore = () => {
    if (!isLoading.value && hasMore.value) {
      fetchAlbums()
    }
  }

  const getAlbumBySlug = (slug: string) => {
    return albums.value.find(album => {
      const albumSlug = `${album.name} - ${album.artist}`.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      return albumSlug === slug.toLowerCase()
    })
  }

  const getAlbumSlug = (album: Album) => {
    return `${album.name} - ${album.artist}`.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  onMounted(() => {
    fetchAlbums(true)
  })

  return {
    albums,
    hasMore,
    isLoading,
    loadMore,
    fetchAlbums,
    getAlbumBySlug,
    getAlbumSlug
  }
}
