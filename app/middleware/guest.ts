export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useSupabaseAuth()
  
  // If user is authenticated, redirect to home
  if (user.value) {
    return navigateTo('/')
  }
})
