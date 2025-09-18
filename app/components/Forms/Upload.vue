<script setup lang="ts">
  const props = withDefaults(
    defineProps<{ currentTab?: 'music' | 'movies' }>(),
    { currentTab: 'music' },
  )

  const { fileInput, uploadError, uploadSuccess, uploading, uploadFile } =
    useUpload(props.currentTab)
</script>

<template>
  <form
    class="grid gap-4"
    enctype="multipart/form-data"
    @submit.prevent="uploadFile"
  >
    <h2 class="font-serif text-xl">Upload {{ props.currentTab }}</h2>
    <input
      ref="fileInput"
      class="border border-(--sand) p-2 uppercase"
      type="file"
      name="files"
      multiple
      required
    />
    <button
      type="submit"
      class="cursor-pointer border border-(--sand) p-2 uppercase"
      :disabled="uploading"
    >
      <span v-if="uploading">Uploading...</span>
      <span v-else>Upload</span>
    </button>
    <p v-if="uploadError" class="text-red-600">{{ uploadError }}</p>
    <p v-if="uploadSuccess" class="text-green-600">{{ uploadSuccess }}</p>
  </form>
</template>
