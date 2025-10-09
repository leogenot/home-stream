<script setup lang="ts">
  const { files, deleteFile, fetchFiles } = useUpload()

  onMounted(() => {
    fetchFiles()
  })

  // Setup scroll animation
  const filesContainer = ref<HTMLElement | null>(null)
  const { setupObserver } = useScrollAnimation(filesContainer)

  // Re-setup observer when files change
  watch(files, () => {
    nextTick(() => {
      setupObserver()
    })
  })
</script>

<template>
  <div>
    <h2 class="font-serif text-xl">Uploaded music:</h2>
    <ul
      v-if="files.length"
      ref="filesContainer"
      class="files-list mt-4 grid gap-2"
      aria-label="Uploaded music files"
    >
      <li
        v-for="file in files"
        :key="file.id"
        class="file-item border-default flex items-center justify-between gap-4 border px-2 py-4"
      >
        <h3 class="truncate font-serif text-sm text-wrap overflow-ellipsis">
          {{ file.title }}
          <span class="text-xs opacity-80">- {{ file.artist }}</span>
        </h3>
        <button
          class="shrink-0 text-sm"
          :aria-label="`Delete ${file.title} by ${file.artist}`"
          @click="deleteFile(file.file)"
        >
          <UIcon name="i-lucide-circle-x" class="size-5" aria-hidden="true" />
        </button>
      </li>
    </ul>
    <p v-else class="text-gray-500" role="status">No uploaded music yet.</p>
  </div>
</template>

<style scoped>
  .files-list .file-item {
    transform: scale(0.985);
    opacity: 0;
    transition:
      transform 400ms ease,
      opacity 400ms ease;
    will-change: transform, opacity;
  }

  .files-list .file-item.in-view {
    transform: scale(1);
    opacity: 1;
  }
</style>
