export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useSupabaseAuth()
  const supabase = useSupabaseClient()

  // Wait for the session to be restored on client-side
  if (import.meta.client) {
    const { data: { session } } = await supabase.auth.getSession()

    // If no session exists, redirect to login
    if (!session) {
      return navigateTo('/auth/login')
    }
  } else {
    // On server-side, check the user from Supabase module
    if (!user.value) {
      return navigateTo('/auth/login')
    }
  }
})
