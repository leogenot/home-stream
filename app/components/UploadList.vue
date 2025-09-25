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
        class="flex items-center justify-between border border-black/40 p-2"
      >
        <h3 class="font-serif text-lg">{{ file.file }}</h3>
        <button
          class="text-sm text-red-600 hover:underline"
          @click="deleteFile(file.file)"
        >
          Delete
        </button>
      </div>
    </div>
    <p v-else class="text-gray-500">No uploaded music yet.</p>
  </div>
</template>
