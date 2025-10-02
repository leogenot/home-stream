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
    <UFileUpload
      v-model="fileInput"
      layout="list"
      multiple
      :dropzone="true"
      class="min-h-12 w-full"
    />
    <UButton
      type="submit"
      :loading="uploading"
      loading-icon="i-lucide-loader"
      variant="subtle"
      color="neutral"
      class="justify-center p-2 uppercase"
    >
      Upload
    </UButton>
    <p v-if="uploadError" class="text-red-600">{{ uploadError }}</p>
    <p v-if="uploadSuccess" class="text-green-600">{{ uploadSuccess }}</p>
  </form>
</template>
