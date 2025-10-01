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

  const color = computed(() => (colorMode.value === 'dark' ? 'black' : 'white'))
  useHead({
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { key: 'theme-color', name: 'theme-color', content: color },
    ],
    link: [{ rel: 'icon', href: '/favicon.ico' }],
    htmlAttrs: {
      lang: 'en',
    },
  })
</script>

<template>
  <UApp>
    <DevGrid />
    <NuxtLayout :name="authLayout">
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
