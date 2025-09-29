<script setup lang="ts">
  const { files, deleteFile, fetchFiles } = useUpload()
  onMounted(() => {
    fetchFiles()
  })
</script>

<template>
  <div>
    <h2 class="font-serif text-xl">Uploaded music:</h2>
    <div v-if="files.length" class="mt-4 grid gap-2">
      <div
        v-for="file in files"
        :key="file.id"
        class="flex items-center justify-between gap-4 border border-black/40 px-2 py-4"
      >
        <h3 class="truncate font-serif text-sm text-wrap overflow-ellipsis">
          {{ file.file }}
        </h3>
        <button
          class="shrink-0 text-sm text-red-600 hover:underline"
          @click="deleteFile(file.file)"
        >
          Delete
        </button>
      </div>
    </div>
    <p v-else class="text-gray-500">No uploaded music yet.</p>
  </div>
</template>
