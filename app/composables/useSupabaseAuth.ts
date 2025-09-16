import type { Provider, Subscription } from '@supabase/supabase-js'
import { ref } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

export function useSupabaseAuth() {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { setCurrentError } = useErrorMessage()
    const isLoading = ref(false)
    let authListener: Subscription | null = null

    const { loadUser, clearUser } = useUser()

    const initAuthListener = async () => {
        // Setup auth state change listener
        const {
            data: { subscription },
        } = await supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('EVENT', event)
            if (event === 'INITIAL_SESSION') {
                if (session?.user) {
                    console.log('Session restored')
                    await loadUser(session?.user)
                }
            } else if (event === 'SIGNED_IN') {
                if (session?.user) {
                    console.log('User logged in')
                    await loadUser(session?.user)
                }
            } else if (event === 'SIGNED_OUT') {
                console.log('User logged out')
            }
        })

        authListener = subscription
    }
    const unsubscribeAuthListener = () => {
        console.log('unsubscribe')
        if (authListener) {
            try {
                authListener.unsubscribe()
            } catch (err) {
                console.error('Failed to unsubscribe auth listener:', err)
            }
            authListener = null
        }
    }

    const signUpNewUser = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({ email, password })

            if (error) throw new Error(error.message)

            return { data, error: null }
        } catch (err: any) {
            return { data: null, error: err.message }
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        const showLoaderDelay = 300
        let loaderTimeout: ReturnType<typeof setTimeout>

        loaderTimeout = setTimeout(() => {
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
        } catch (err: any) {
            clearTimeout(loaderTimeout)
            isLoading.value = false
            return { data: null, error: err.message }
        }
    }

    const signInWithOAuth = async (provider: Provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${useRuntimeConfig().public.BASE_URL}/confirm`,
            },
        })

        if (error) console.error(error)
    }

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.log(error)
                throw new Error(error.message)
            }

            clearUser()

            return { error: null }
        } catch (err: any) {
            return { error: err.message }
        }
    }

    const resetPassword = async (email: string) => {
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${useRuntimeConfig().public.BASE_URL}/account/update-password`,
            })

            if (error) throw new Error(error.message)

            return { error: null }
        } catch (err: any) {
            return { error: err.message }
        }
    }

    const updatePassword = async (new_password: string) => {
        const { data, error } = await supabase.auth.updateUser({
            password: new_password,
        })

        if (error) {
            console.error('Error updating password:', error)
        }

        return { data, error }
    }

    const upsertUserDetails = async (
        id: string,
        firstname: string,
        lastname: string,
    ) => {
        const { data: existingUser, error: fetchError } = await supabase
            .from('user_details')
            .select('subscription_status, subscription_plan')
            .eq('id', id)
            .maybeSingle()

        if (fetchError) {
            console.error('Error fetching existing user:', fetchError)
            throw fetchError
        }

        const { data, error } = await supabase
            .from('user_details')
            .upsert(
                {
                    id,
                    firstname,
                    lastname,
                },
                { onConflict: 'id' },
            )
            .select()

        if (error) {
            setCurrentError('Error upserting user details: ' + error)
            console.error('Error upserting user details:', error)
            throw error
        }

        return { data, error }
    }

    return {
        user,
        isLoading,
        signUpNewUser,
        signInWithEmail,
        signInWithOAuth,
        upsertUserDetails,
        signOut,
        resetPassword,
        updatePassword,
        initAuthListener,
        unsubscribeAuthListener,
    }
}