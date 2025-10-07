export default defineNuxtRouteMiddleware(async (to) => {
    // Skip auth check on login and confirm pages to prevent redirect loops
    if (to.path === '/login' || to.path === '/confirm') {
        return
    }

    // Avoid running on the server to prevent SSR flashes; rely on client check
    if (import.meta.server) {
        return
    }

    const supabase = useSupabaseClient()

    // Explicitly get the current session on the client before deciding to redirect
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
        return navigateTo({
            path: '/login',
            query: { redirect: to.fullPath },
        })
    }
})
