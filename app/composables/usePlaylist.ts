import { useSupabaseClient } from '#imports'

const USER_STORAGE_KEY = 'stream-user'

export type User = {
    id: string
    auth_user_id: string
    created_at: string
    email: string
    username: string | null
}

export type Music = { id: number; file: string; created_at: string }
export type Movie = { id: number; file: string; created_at: string }

export type PlaylistItem = { id: number; position: number; file: { id: number; file: string } }
export type Playlist = { id: number; title: string; created_at: string; playlist_items: PlaylistItem[] }

const TABLES = {
    music: {
        playlists: 'music_playlists',
        items: 'music_playlist_items',
        itemKey: 'music_id',
        fetchItemsAlias: 'playlist_items',
    },
    movies: {
        playlists: 'movies_playlists',
        items: 'movies_playlist_items',
        itemKey: 'movie_id',
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
    const movies = ref<Movie[]>([])
    const selectedMusicIds = ref<number[]>([])
    const selectedMoviesIds = ref<number[]>([])
    const newPlaylistTitle = ref('')
    const playlistSuccess = ref('')
    const playlistError = ref('')

    // Fetch playlists with normalized items
    const fetchPlaylists = async (currentTab: 'music' | 'movies') => {
        if (!userData.value) return
        const { playlists: playlistTable, items: itemsTable, itemKey } = TABLES[currentTab]

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
                    ${currentTab} (id, file)
                    )
                `)
            .eq('user_id', userData.value.auth_user_id)
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
                file: item[currentTab],
            })),
        }))
    }

    const fetchMusics = async () => {
        if (!userData.value) return
        const { data, error } = await supabase
            .from('music')
            .select('id, file, created_at')
            .eq('user_id', userData.value.auth_user_id)
            .order('created_at', { ascending: false })
        if (!error && data) musics.value = data
    }

    const fetchMovies = async () => {
        if (!userData.value) return
        const { data, error } = await supabase
            .from('movies')
            .select('id, file, created_at')
            .eq('user_id', userData.value.auth_user_id)
            .order('created_at', { ascending: false })
        if (!error && data) movies.value = data
    }

    const createPlaylist = async (currentTab: 'music' | 'movies') => {
        playlistError.value = ''
        playlistSuccess.value = ''
        if (!userData.value) return

        try {
            const { playlists: playlistTable, items: itemsTable, itemKey } = TABLES[currentTab]

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
            const ids = currentTab === 'music' ? selectedMusicIds.value : selectedMoviesIds.value

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
            selectedMoviesIds.value = []
            fetchPlaylists(currentTab)
        } catch (err: any) {
            console.error(err)
            playlistError.value = err.message
        }
    }

    const deletePlaylist = async (currentTab: 'music' | 'movies', playlistId: number) => {
        playlistError.value = ''
        playlistSuccess.value = ''
        try {
            const { playlists: playlistTable, items: itemsTable } = TABLES[currentTab]
            await supabase.from(itemsTable).delete().eq('playlist_id', playlistId)
            await supabase.from(playlistTable).delete().eq('id', playlistId)
            playlistSuccess.value = 'Playlist deleted successfully!'
            fetchPlaylists(currentTab)
        } catch (err: any) {
            console.error(err)
            playlistError.value = err.message
        }
    }

    const addItemsToPlaylist = async (
        currentTab: 'music' | 'movies',
        playlistId: number,
        fileIds: number[],
    ) => {
        try {
            const { items: itemsTable, itemKey } = TABLES[currentTab]
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
            fetchPlaylists(currentTab)
        } catch (err: any) {
            console.error(err)
            playlistError.value = err.message
        }
    }

    const removeItemFromPlaylist = async (currentTab: 'music' | 'movies', itemId: number) => {
        try {
            const { items: itemsTable } = TABLES[currentTab]
            await supabase.from(itemsTable).delete().eq('id', itemId)
            playlistSuccess.value = 'Item removed from playlist!'
            fetchPlaylists(currentTab)
        } catch (err: any) {
            console.error(err)
            playlistError.value = err.message
        }
    }

    onMounted(() => {
        fetchMusics()
        fetchMovies()
    })

    watchEffect(() => {
        if (userData.value) fetchPlaylists('music')
    })

    return {
        playlists,
        musics,
        movies,
        selectedMusicIds,
        selectedMoviesIds,
        newPlaylistTitle,
        playlistSuccess,
        playlistError,
        fetchPlaylists,
        fetchMusics,
        fetchMovies,
        createPlaylist,
        deletePlaylist,
        addItemsToPlaylist,
        removeItemFromPlaylist,
    }
}
