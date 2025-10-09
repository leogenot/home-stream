<script setup lang="ts">
  const _props = defineProps<{
    item: any
  }>()
  const { removeItemFromPlaylist } = usePlaylist()
</script>

<template>
  <li class="flex items-center justify-between">
    <span>{{ item?.file.title || 'Unknown' }}</span>
    <button
      class="text-xs text-red-500"
      :aria-label="`Remove ${item?.file.title || 'Unknown'} from playlist`"
      @click="removeItemFromPlaylist(item.id)"
    >
      Remove
    </button>
  </li>
</template>
