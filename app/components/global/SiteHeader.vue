<!-- <script setup lang="ts">
  const currentPage = computed(() => {
    return useRoute().path === '/' ? 'Home' : useRoute().name
  })
</script>

<template>
  <header
    class="fixed top-5 left-1/2 flex w-fit -translate-x-1/2 items-center justify-between gap-4 rounded-sm p-2 backdrop-blur-lg"
  >
    <div class="current-page uppercase">{{ currentPage }}</div>
    <div class="burger"><icons-burger /></div>
  </header>
</template> -->

<script setup>
  import { useToggle } from '@vueuse/core'

  const route = useRoute()

  const [isOpen, toggle] = useToggle()

  const currentPage = computed(() => {
    return useRoute().path === '/' ? 'Home' : useRoute().name
  })

  watch(route, () => {
    isOpen.value = false
  })
</script>
<template>
  <div
    class="px-bleed lg:w-cols-2 fixed bottom-4 left-1/2 z-[10000] flex w-full -translate-x-1/2 justify-center rounded-sm border border-black/20 p-2 text-(--black) backdrop-blur-lg"
  >
    <div class="flex w-full items-center justify-between text-sm uppercase">
      <nuxt-link to="/" aria-label="Go to homepage">Home</nuxt-link>
      <nuxt-link to="/movies" aria-label="Go to movies">Movies</nuxt-link>
      <nuxt-link to="/music" aria-label="Go to music">Music</nuxt-link>
    </div>
  </div>
</template>
