import { useSupabaseClient } from '#imports'

const USER_STORAGE_KEY = 'stream-user'

export type User = {
    id: string
    auth_user_id: string
    created_at: string
    email: string
    username: string | null
}

export type Music = { id: number; file: string; title: string; artist: string; album: string; cover: string; created_at: string }

export type PlaylistItem = { id: number; position: number; file: { id: number; file: string; title: string; artist: string; album: string; cover: string; } }
export type Playlist = { id: number; title: string; created_at: string; playlist_items: PlaylistItem[] }

const TABLES = {
    music: {
        playlists: 'music_playlists',
        items: 'music_playlist_items',
        itemKey: 'music_id',
        fetchItemsAlias: 'playlist_items',
    },
}

export default function usePlaylist() {
    const supabase = useSupabaseClient()

    const userData = useState<User | undefined | null>('userData', () => null)
    const error = ref<string | null>(null)

    // fetch user from localStorage
    onMounted(() => {
        const stored = localStorage.getItem(USER_STORAGE_KEY)
        if (stored) {
            try {
                userData.value = JSON.parse(stored)
            } catch (e) {
                console.warn('Failed to parse user from localStorage', e)
            }
        }
    })

    const playlists = ref<Playlist[]>([])
    const musics = ref<Music[]>([])
    const selectedMusicIds = ref<number[]>([])
    const newPlaylistTitle = ref('')
    const playlistSuccess = ref('')
    const playlistError = ref('')

    // Fetch playlists with normalized items
    const fetchPlaylists = async () => {
        if (!userData.value || !userData.value?.auth_user_id) return
        const { playlists: playlistTable, items: itemsTable, itemKey } = TABLES['music']

        const { data, error } = await supabase
            .from(playlistTable)
            .select(`
                    id,
                    title,
                    created_at,
                    ${itemsTable} (
                    id,
                    position,
                    ${itemKey},
                    music (id, title, artist, album, cover)
                    )
                `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
            return
        }

        // Normalize items to `playlist_items`
        playlists.value = data.map((p: any) => ({
            ...p,
            playlist_items: p[itemsTable].map((item: any) => ({
                id: item.id,
                position: item.position,
                file: item['music'],
            })),
        }))
    }

    const fetchMusics = async () => {
        if (!userData.value || !userData.value?.auth_user_id) return
        const { data, error } = await supabase
            .from('music')
            .select('id, title, album, artist, cover, created_at')
            .order('created_at', { ascending: false })
        if (!error && data) musics.value = data
    }

    const createPlaylist = async () => {
        playlistError.value = ''
        playlistSuccess.value = ''
        if (!userData.value) return

        try {
            const { playlists: playlistTable, items: itemsTable, itemKey } = TABLES['music']

            const { data: playlistData, error: insertError } = await supabase
                .from(playlistTable)
                .insert({
                    title: newPlaylistTitle.value,
                    user_id: userData.value.auth_user_id,
                })
                .select()
                .single()

            if (insertError) throw insertError

            const playlistId = playlistData.id
            const ids = selectedMusicIds.value

            if (ids.length) {
                const playlistItems = ids.map((id, index) => ({
                    playlist_id: playlistId,
                    [itemKey]: id,
                    position: index + 1,
                }))
                await supabase.from(itemsTable).insert(playlistItems)
            }

            playlistSuccess.value = 'Playlist created!'
            newPlaylistTitle.value = ''
            selectedMusicIds.value = []
            fetchPlaylists()
        } catch (err: any) {
            console.error(err)
            playlistError.value = err.message
        }
    }

    const deletePlaylist = async (playlistId: number) => {
        playlistError.value = ''
        playlistSuccess.value = ''
        try {
            const { playlists: playlistTable, items: itemsTable } = TABLES['music']
            await supabase.from(itemsTable).delete().eq('playlist_id', playlistId)
            await supabase.from(playlistTable).delete().eq('id', playlistId)
            playlistSuccess.value = 'Playlist deleted successfully!'
            fetchPlaylists()
        } catch (err: any) {
            console.error(err)
            playlistError.value = err.message
        }
    }

    const addItemsToPlaylist = async (
        playlistId: number,
        fileIds: number[],
    ) => {
        try {
            const { items: itemsTable, itemKey } = TABLES['music']
            const currentItems = playlists.value.find((p) => p.id === playlistId)?.playlist_items || []
            const startPosition = currentItems.length + 1

            if (fileIds.length) {
                const playlistItems = fileIds.map((id, index) => ({
                    playlist_id: playlistId,
                    [itemKey]: id,
                    position: startPosition + index,
                }))
                await supabase.from(itemsTable).insert(playlistItems)
            }

            playlistSuccess.value = 'Items added to playlist!'
            fetchPlaylists()
        } catch (err: any) {
            console.error(err)
            playlistError.value = err.message
        }
    }

    const removeItemFromPlaylist = async (itemId: number) => {
        try {
            const { items: itemsTable } = TABLES['music']
            await supabase.from(itemsTable).delete().eq('id', itemId)
            playlistSuccess.value = 'Item removed from playlist!'
            fetchPlaylists()
        } catch (err: any) {
            console.error(err)
            playlistError.value = err.message
        }
    }

    // Helpers for shareable slugs: 
    // e.g. "/playlists/my-great-mix-42" where 42 is the playlist id
    const slugify = (input: string): string => {
        return (input || '')
            .toString()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '') // remove accents
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const makePlaylistSlug = (title: string, id: number): string => {
        const base = slugify(title)
        return `${base}-${id}`
    }

    const parsePlaylistIdFromSlug = (slug: string | string[] | undefined): number | null => {
        if (!slug) return null
        const s = Array.isArray(slug) ? slug[0] : slug
        const match = s.match(/-(\d+)$/)
        if (!match) return null
        const id = Number(match[1])
        return Number.isFinite(id) ? id : null
    }

    const fetchPlaylistById = async (
        playlistId: number,
    ): Promise<Playlist | null> => {
        const { playlists: playlistTable, items: itemsTable, itemKey } = TABLES['music']
        const { data, error: fetchError } = await supabase
            .from(playlistTable)
            .select(`
                id,
                title,
                created_at,
                ${itemsTable} (
                    id,
                    position,
                    ${itemKey},
                    music (id, title,artist,album,cover)
                )
            `)
            .eq('id', playlistId)
            .single()

        if (fetchError || !data) {
            if (fetchError) console.error(fetchError)
            return null
        }

        return {
            id: data.id,
            title: data.title,
            created_at: data.created_at,
            playlist_items: (data as any)[itemsTable].map((item: any) => ({
                id: item.id,
                position: item.position,
                file: item['music'],
            })),
        }
    }

    onMounted(() => {
        fetchMusics()
    })

    watchEffect(() => {
        if (userData.value) fetchPlaylists()
    })

    return {
        playlists,
        musics,
        selectedMusicIds,
        newPlaylistTitle,
        playlistSuccess,
        playlistError,
        fetchPlaylists,
        fetchMusics,
        createPlaylist,
        deletePlaylist,
        addItemsToPlaylist,
        removeItemFromPlaylist,
        fetchPlaylistById,
        slugify,
        makePlaylistSlug,
        parsePlaylistIdFromSlug,
    }
}
