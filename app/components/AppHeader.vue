<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  defineProps<{
    links: NavigationMenuItem[]
  }>()
</script>

<template>
  <div
    class="safe-bottom fixed right-2 left-2 z-10 mx-auto lg:bottom-4"
    style="bottom: max(0.5rem, env(safe-area-inset-bottom))"
  >
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="bg-muted/80 border-muted/50 w-full items-center justify-center rounded-xl border px-4 shadow-lg shadow-neutral-950/5 backdrop-blur-sm"
      :ui="{
        root: '[&>div]:w-full',
        list: 'flex items-center justify-between w-full gap-1.5',
        link: 'py-1 px-0',
        linkLeadingIcon: 'hidden',
      }"
    />
  </div>
</template>
