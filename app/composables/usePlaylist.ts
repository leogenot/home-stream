import { useSupabaseClient } from '#imports'

const USER_STORAGE_KEY = 'stream-user'

export type User = {
    id: string
    auth_user_id: string
    created_at: string
    email: string
    username: string | null
}

export default function usePlaylist() {
    const supabase = useSupabaseClient()

    const userData = useState<User | undefined | null>(
        'userData',
        () => null,
    )
    const error = ref<string | null>(null)

    // fetch user from localstorage
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

    const playlists = ref<any[]>([])
    const musics = ref<any[]>([])
    const movies = ref<any[]>([])
    const selectedMoviesIds = ref<number[]>([])
    const selectedMusicIds = ref<number[]>([])
    const newPlaylistTitle = ref('')
    const newPlaylistDescription = ref('')
    const playlistSuccess = ref('')
    const playlistError = ref('')

    const fetchPlaylists = async (currentTab: 'music' | 'movies') => {
        if (!userData.value) return
        const table = currentTab === 'music' ? 'music_playlists' : 'movies_playlists'

        const { data, error } = await supabase
            .from(table)
            .select(`
                id,
                title,
                created_at,
                playlist_items (
                  id,
                  position,
                  music_id,
                  movie_id,
                  music (id, file),
                  movies (id, title)
                )
            `)
            .eq('user_id', userData.value.auth_user_id)
            .order('created_at', { ascending: false })

        if (!error && data) playlists.value = data
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
            const table = currentTab === 'music' ? 'music_playlists' : 'movies_playlists'
            const { data: playlistData, error: playlistErrorInsert } = await supabase
                .from(table)
                .insert({
                    title: newPlaylistTitle.value,
                    user_id: userData.value.auth_user_id,
                })
                .select()
                .single()

            if (playlistErrorInsert) throw playlistErrorInsert

            const playlistId = playlistData.id
            const playlistItems =
                currentTab === 'music'
                    ? selectedMusicIds.value.map((musicId, index) => ({
                        playlist_id: playlistId,
                        music_id: musicId,
                        position: index + 1,
                    }))
                    : selectedMoviesIds.value.map((movieId, index) => ({
                        playlist_id: playlistId,
                        movie_id: movieId,
                        position: index + 1,
                    }))

            if (playlistItems.length) {
                const { error: itemsError } = await supabase
                    .from('playlist_items')
                    .insert(playlistItems)
                if (itemsError) throw itemsError
            }

            playlistSuccess.value = 'Playlist created!'
            newPlaylistTitle.value = ''
            selectedMusicIds.value = []
            selectedMoviesIds.value = []
            fetchPlaylists(currentTab)
        } catch (err: any) {
            playlistError.value = err.message
        }
    }

    const deletePlaylist = async (currentTab: 'music' | 'movies', playlistId: number) => {
        playlistError.value = ''
        playlistSuccess.value = ''
        try {
            await supabase.from('playlist_items').delete().eq('playlist_id', playlistId)
            const table = currentTab === 'music' ? 'music_playlists' : 'movies_playlists'
            await supabase.from(table).delete().eq('id', playlistId)
            playlistSuccess.value = 'Playlist deleted successfully!'
            fetchPlaylists(currentTab)
        } catch (err: any) {
            playlistError.value = err.message
        }
    }

    const addItemsToPlaylist = async (
        currentTab: 'music' | 'movies',
        playlistId: number,
        fileIds: number[],
    ) => {
        try {
            const currentItems =
                playlists.value.find((p) => p.id === playlistId)?.playlist_items || []
            const startPosition = currentItems.length + 1
            const playlistItems =
                currentTab === 'music'
                    ? fileIds.map((musicId, index) => ({
                        playlist_id: playlistId,
                        music_id: musicId,
                        position: startPosition + index,
                    }))
                    : fileIds.map((movieId, index) => ({
                        playlist_id: playlistId,
                        movie_id: movieId,
                        position: startPosition + index,
                    }))

            if (playlistItems.length) {
                await supabase.from('playlist_items').insert(playlistItems)
            }
            playlistSuccess.value = 'Items added to playlist!'
            fetchPlaylists(currentTab)
        } catch (err: any) {
            playlistError.value = err.message
        }
    }

    const removeItemFromPlaylist = async (currentTab: 'music' | 'movies', itemId: number) => {
        try {
            await supabase.from('playlist_items').delete().eq('id', itemId)
            playlistSuccess.value = 'Item removed from playlist!'
            fetchPlaylists(currentTab)
        } catch (err: any) {
            playlistError.value = err.message
        }
    }

    onMounted(() => {
        fetchPlaylists('music') // default tab
        fetchMusics()
        fetchMovies()
    })

    watchEffect(() => {
        if (userData.value) fetchPlaylists('music')
    })

    return {
        playlists,
        musics,
        selectedMusicIds,
        movies,
        selectedMoviesIds,
        newPlaylistTitle,
        newPlaylistDescription,
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
