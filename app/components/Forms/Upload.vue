<script setup lang="ts">
  const { fileInput, uploadError, uploadSuccess, uploading, uploadFile } =
    useUpload()
</script>

<template>
  <form
    class="grid w-full gap-4 text-sm"
    enctype="multipart/form-data"
    @submit.prevent="uploadFile"
  >
    <h2 class="font-serif text-xl">Upload music</h2>
    <UFileUpload multiple :dropzone="true" class="min-h-12 w-full" />
    <button
      type="submit"
      class="border-default h-fit cursor-pointer border p-2 uppercase"
      :disabled="uploading"
    >
      <span v-if="uploading">Uploading...</span>
      <span v-else>Upload</span>
    </button>
    <p v-if="uploadError" class="text-red-600">{{ uploadError }}</p>
    <p v-if="uploadSuccess" class="text-green-600">{{ uploadSuccess }}</p>
  </form>
</template>
