<script lang="ts" setup>
  import { useSupabaseAuth } from '~/composables/useSupabaseAuth'
  const { initAuthListener, unsubscribeAuthListener } = useSupabaseAuth()
  const { userData } = useUser()

  // Track if auth has been initialized to prevent premature redirects
  const authInitialized = ref(false)
  const isInitializing = ref(true)

  onMounted(async () => {
    try {
      await initAuthListener()
      // Give a small delay to ensure auth state is properly set
      await new Promise((resolve) => setTimeout(resolve, 100))
      authInitialized.value = true
      isInitializing.value = false
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      authInitialized.value = true
      isInitializing.value = false
    }
  })

  onUnmounted(() => {
    unsubscribeAuthListener()
  })

  const _authLayout = computed(() => {
    return userData.value ? 'default' : 'auth'
  })

  const colorMode = useColorMode()

  const color = computed(() =>
    colorMode.value === 'dark' ? '#000000' : '#ffffff',
  )
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()

  useHead({
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { key: 'theme-color', name: 'theme-color', content: color },
    ],
    link: [
      { rel: 'icon', href: '/favicon.ico' },
      {
        key: 'canonical',
        rel: 'canonical',
        href: () => `${runtimeConfig.public.BASE_URL}${route.path}`,
      },
    ],
    htmlAttrs: {
      lang: 'en',
    },
  })

  const showCover = useState('showCover', () => false)

  watch(showCover, (isShown) => {
    if (!import.meta.client) return
    if (isShown) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
    }
  })
</script>

<template>
  <UApp>
    <!-- Show loading state while auth is initializing -->
    <div
      v-if="isInitializing"
      class="flex min-h-screen items-center justify-center"
    >
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-lucide-loader-2" class="h-8 w-8 animate-spin" />
        <p class="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
    <!-- Show app content once auth is initialized -->
    <template v-else>
      <NuxtLayout>
        <UMain class="relative pb-56">
          <div>
            <NuxtPage />
          </div>
        </UMain>
      </NuxtLayout>
    </template>
    <transition mode="out-in" name="fade">
      <div
        v-if="showCover"
        class="backdrop bg-muted/20 fixed top-0 left-0 h-full w-full backdrop-blur-lg"
        @click="showCover = false"
      />
    </transition>
  </UApp>
</template>
