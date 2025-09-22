<script setup lang="ts">
  const _props = defineProps<{
    item: any
  }>()
  const { removeItemFromPlaylist } = usePlaylist()
</script>

<template>
  <li class="flex items-center justify-between">
    {{ item?.file.file || 'Unknown' }}
    <button
      class="text-xs text-red-500"
      @click="removeItemFromPlaylist(item.id)"
    >
      Remove
    </button>
  </li>
</template>
