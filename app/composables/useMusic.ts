import { useSupabaseClient } from '#imports'

const USER_STORAGE_KEY = 'stream-user'

const PAGE_SIZE = 50

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
                // Failed to parse user from localStorage
            }
        }
    })

    const songs = ref<Song[]>([])
    const hasMore = ref(true)
    const isLoading = ref(false)
    const currentPage = ref(0)

    const fetchMusics = async (reset = false) => {
        if (!userData.value || !userData.value?.auth_user_id) return
        if (isLoading.value || (!hasMore.value && !reset)) return

        isLoading.value = true

        if (reset) {
            currentPage.value = 0
            songs.value = []
            hasMore.value = true
        }

        const from = currentPage.value * PAGE_SIZE
        const to = from + PAGE_SIZE - 1

        const { data, error } = await supabase
            .from('music')
            .select('id, title, file, artist, album, created_at')
            .order('created_at', { ascending: false })
            .range(from, to)

        if (!error && data) {
            if (reset) {
                songs.value = data
            } else {
                songs.value = [...songs.value, ...data]
            }
            hasMore.value = data.length === PAGE_SIZE
            currentPage.value++
        }

        isLoading.value = false
    }

    const loadMore = () => {
        if (!isLoading.value && hasMore.value) {
            fetchMusics()
        }
    }

    onMounted(() => {
        fetchMusics(true)
    })

    return {
        songs,
        hasMore,
        isLoading,
        loadMore,
        fetchMusics,
    }
}
