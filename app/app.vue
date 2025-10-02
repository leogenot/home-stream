<script lang="ts" setup>
  import { useSupabaseAuth } from '~/composables/useSupabaseAuth'
  const { initAuthListener, unsubscribeAuthListener } = useSupabaseAuth()
  const { userData } = useUser()
  onMounted(async () => {
    await initAuthListener()
  })

  onUnmounted(() => {
    unsubscribeAuthListener()
  })
  const authLayout = computed(() => {
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
    <DevGrid />
    <NuxtLayout :name="authLayout">
      <UMain class="relative pb-56">
        <div>
          <NuxtPage />
        </div>
      </UMain>
    </NuxtLayout>
    <transition mode="out-in" name="fade">
      <div
        v-if="showCover"
        class="backdrop bg-muted/20 fixed top-0 left-0 h-full w-full backdrop-blur-lg"
        @click="showCover = false"
      />
    </transition>
  </UApp>
</template>
