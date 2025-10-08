import { useSupabaseClient, useSupabaseUser } from '#imports'

type AuthSubscription = {
    unsubscribe: () => void
}

export function useSupabaseAuth() {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const isLoading = ref(false)
    let authListener: AuthSubscription | null = null
    const { loadUser, clearUser } = useUser()


    const initAuthListener = async () => {
        // Get initial session first to avoid race conditions
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!error && session?.user) {
            await loadUser(session.user as unknown as User)
        }

        // Setup auth state change listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'INITIAL_SESSION') {
                if (session?.user) {
                    await loadUser(session?.user as unknown as User)
                }
            } else if (event === 'SIGNED_IN') {
                if (session?.user) {
                    await loadUser(session?.user as unknown as User)
                }
            } else if (event === 'SIGNED_OUT') {
                // User logged out
            }
        })

        authListener = subscription
    }

    const unsubscribeAuthListener = () => {
        if (authListener) {
            try {
                authListener.unsubscribe()
            } catch {
                // Failed to unsubscribe
            }
            authListener = null
        }
    }
    const signUpNewUser = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({ email, password })

            if (error) throw new Error(error.message)

            return { data, error: null }
        } catch (err) {
            return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
        }
    }


    const signInWithEmail = async (email: string, password: string) => {
        const showLoaderDelay = 300

        const loaderTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {
            isLoading.value = true
        }, showLoaderDelay)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            clearTimeout(loaderTimeout)
            isLoading.value = false
            if (error) throw new Error(error.message)

            return { data, error: null }
        } catch (err) {
            clearTimeout(loaderTimeout)
            isLoading.value = false
            return { data: null, error: err instanceof Error ? err.message : 'Unknown error' }
        }
    }

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                throw new Error(error.message)
            }

            clearUser()

            return { error: null }
        } catch (err) {
            return { error: err instanceof Error ? err.message : 'Unknown error' }
        }
    }

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${useRuntimeConfig().public.BASE_URL}/auth/new-password`,
            })

            if (error) throw new Error(error.message)

            return { error: null }
        } catch (err) {
            return { error: err instanceof Error ? err.message : 'Unknown error' }
        }
    }

    const updatePassword = async (new_password: string) => {
        const { data, error } = await supabase.auth.updateUser({
            password: new_password,
        })

        return { data, error }
    }

    const upsertUserDetails = async (
        username: string,
    ) => {
        if (!user.value?.id) {
            throw new Error('User not authenticated')
        }

        // Note: Supabase type generation needs to be configured for proper type inference
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - Supabase type generation issue
        const { data, error } = await supabase
            .from('user_details')
            .update({ username })
            .eq('auth_user_id', user.value.id)
            .select();

        if (error) {
            throw error
        }

        return { data, error }
    }


    return {
        user,
        isLoading,
        signUpNewUser,
        signInWithEmail,
        upsertUserDetails,
        signOut,
        resetPassword,
        updatePassword,
        initAuthListener,
        unsubscribeAuthListener,
    }
}
