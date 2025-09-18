<script setup lang="ts">
  const props = withDefaults(
    defineProps<{ currentTab?: 'music' | 'movies' }>(),
    { currentTab: 'music' },
  )

  const { files, deleteFile, fetchFiles } = useUpload(props.currentTab)
  watch(
    () => props.currentTab,
    () => {
      fetchFiles(props.currentTab)
    },
  )
</script>

<template>
  <div>
    <h2 class="font-serif text-xl">Uploaded {{ props.currentTab }}:</h2>
    <div v-if="files.length" class="mt-4 grid gap-2">
      <div
        v-for="file in files"
        :key="file.id"
        class="flex items-center justify-between border border-(--sand) p-2"
      >
        <h3 class="font-serif text-lg">{{ file.file }}</h3>
        <button
          class="text-red-600 hover:underline"
          @click="deleteFile(file.file)"
        >
          Delete
        </button>
      </div>
    </div>
    <p v-else class="text-gray-500">No uploaded {{ props.currentTab }} yet.</p>
  </div>
</template>
