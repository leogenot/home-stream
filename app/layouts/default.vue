<script setup lang="ts">
  // const route = useRoute()
  // const currentRoute = computed(() => {
  //   return route.meta.title
  // })
</script>
<template>
  <main class="px-bleed pt-bleed relative h-full">
    <div class="min-h-screen pb-32">
      <slot />
    </div>
    <site-navbar />
    <floaty-player />
  </main>
</template>
