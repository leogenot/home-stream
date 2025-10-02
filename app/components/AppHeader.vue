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
      class="bg-muted/80 border-muted/50 justify-between rounded-xl border px-2 shadow-lg shadow-neutral-950/5 backdrop-blur-sm sm:px-4"
      :ui="{
        link: 'px-2 py-1',
        linkLeadingIcon: 'hidden',
      }"
    >
      <template #list-trailing>
        <ColorModeButton />
      </template>
    </UNavigationMenu>
  </div>
</template>
