import { ref, onMounted, watch } from 'vue'
import { useSupabaseClient } from '#imports'

const USER_STORAGE_KEY = 'stream-user'

export type User = {
    id: string
    auth_user_id: string
    created_at: string
    email: string
    username: string | null
}

export default function useUser() {
    const supabase = useSupabaseClient()

    const userData = useState<User | undefined | null>(
        'userData',
        () => null,
    )
    const loadingUserDetails = ref(false)
    const error = ref<string | null>(null)

    // fetch user from localstorage
    onMounted(() => {
        const stored = localStorage.getItem(USER_STORAGE_KEY)
        if (stored) {
            try {
                console.log('Getting stored')
                userData.value = JSON.parse(stored)
            } catch (e) {
                console.warn('Failed to parse user from localStorage', e)
            }
        }
    })

    // update localstorage when user changes
    watch(
        userData,
        (newVal, oldVal) => {
            // Always update localStorage if userData changes
            if (newVal !== oldVal) {
                console.log('User data changed, updating localStorage')
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newVal))
            }
        },
        { deep: true },
    )

    // load details when user logs in
    const loadUser = async (user: User) => {
        if (!user) return

        loadingUserDetails.value = true
        error.value = null
        console.log('user id', user.id)

        try {
            const { data, error: queryError } = await supabase
                .from('user_details')
                .select('*')
                .eq('auth_user_id', user.id)
                .maybeSingle()

            if (queryError) throw new Error(queryError.message)
            console.log('Setting user data')
            userData.value = data
        } catch (err: any) {
            error.value = err.message || 'Failed to load user'
        } finally {
            loadingUserDetails.value = false
        }
    }

    const clearUser = () => {
        userData.value = null
        localStorage.removeItem(USER_STORAGE_KEY)
    }

    // Force clear localStorage and reload from database
    const forceRefreshUserData = async () => {
        if (!userData.value || !userData.value.id) return
        // Clear localStorage first
        localStorage.removeItem(USER_STORAGE_KEY)
        console.log('userData.value', userData.value)
        loadingUserDetails.value = true
        error.value = null

        try {
            const { data, error: queryError } = await supabase
                .from('user_details')
                .select('*')
                .eq('auth_user_id', userData.value.auth_user_id)
                .maybeSingle()

            if (queryError) throw new Error(queryError.message)
            console.log('Force refreshing user data from database')
            userData.value = data
        } catch (err: any) {
            error.value = err.message || 'Failed to force refresh user'
        } finally {
            loadingUserDetails.value = false
        }
    }

    // Force refresh user data from database
    const refreshUserData = async () => {
        if (!userData.value?.id) return

        loadingUserDetails.value = true
        error.value = null

        try {
            const { data, error: queryError } = await supabase
                .from('user_details')
                .select('*')
                .eq('auth_user_id', userData.value.id)
                .maybeSingle()

            if (queryError) throw new Error(queryError.message)
            console.log('Refreshing user data')
            userData.value = data
        } catch (err: any) {
            error.value = err.message || 'Failed to refresh user'
        } finally {
            loadingUserDetails.value = false
        }
    }

    const isUser = computed(() => !!userData.value)

    return {
        isUser,
        userData,
        loadUser,
        clearUser,
        refreshUserData,
        forceRefreshUserData,
        loadingUserDetails,
        error,
    }
}