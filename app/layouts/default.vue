<script setup lang="ts">
  const route = useRoute()
  const currentRoute = computed(() => {
    return route.meta.title
  })
</script>
<template>
  <main class="px-bleed relative h-full pt-4">
    <nav class="header gap-gap inline-flex w-full items-center">
      <h1 class="current-route text-center font-serif text-xl">
        {{ currentRoute }}
      </h1>
    </nav>
    <div class="pt-16">
      <slot />
    </div>
    <site-navbar />
    <floaty-player />
  </main>
</template>
