import { useSupabaseClient } from '#imports'

const USER_STORAGE_KEY = 'stream-user'

export type User = {
    id: string
    auth_user_id: string
    created_at: string
    email: string
    username: string | null
}

export type Song = { id: number; file: string; title: string; artist: string; album: string; created_at: string }

export default function useMusic() {
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
                console.warn('Failed to parse user from localStorage', e)
            }
        }
    })

    const songs = ref<Song[]>([])

    const fetchMusics = async () => {
        if (!userData.value || !userData.value?.auth_user_id) return
        const { data, error } = await supabase
            .from('music')
            .select('id, title, file, artist, album, created_at')
            .order('created_at', { ascending: false })
        if (!error && data) songs.value = data
    }

    onMounted(() => {
        fetchMusics()
    })

    return {
        songs,
    }
}
