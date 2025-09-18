<script setup lang="ts">
  const _props = withDefaults(
    defineProps<{
      currentTab?: 'music' | 'movies'
      item: any
    }>(),
    {
      currentTab: 'music',
    },
  )
  const { removeItemFromPlaylist } = usePlaylist()
</script>

<template>
  <li class="flex items-center justify-between">
    {{ item.music?.file || item.movies?.title || 'Unknown' }}
    <button
      class="text-xs text-red-500"
      @click="removeItemFromPlaylist(currentTab, item.id)"
    >
      Remove
    </button>
  </li>
</template>
