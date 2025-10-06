<script setup lang="ts">
  import { navLinks } from '~/utils/links'
  const user = useSupabaseUser()
  const route = useRoute()

  watch(
    user,
    () => {
      if (!user.value) {
        if (route.path === '/login') return
        return navigateTo({
          path: '/login',
          query: { redirect: route.fullPath },
        })
      }
    },
    { immediate: true },
  )
</script>

<template>
  <div>
    <UContainer class="border-default safe-x px-2 pt-10 sm:border-x">
      <slot />
      <floaty-player />
      <AppHeader v-if="user" :links="navLinks" />
    </UContainer>
  </div>
</template>
