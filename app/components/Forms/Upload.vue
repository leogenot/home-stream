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
    <label for="file-upload" class="sr-only">
      Select music files to upload
    </label>
    <UFileUpload
      id="file-upload"
      v-model="fileInput"
      layout="list"
      multiple
      :dropzone="true"
      class="min-h-12 w-full"
      aria-label="Select music files to upload"
    />
    <UButton
      type="submit"
      :loading="uploading"
      loading-icon="i-lucide-loader"
      variant="subtle"
      color="neutral"
      class="justify-center p-2 uppercase"
      aria-label="Upload selected files"
    >
      Upload
    </UButton>
    <p v-if="uploadError" class="text-red-600" role="alert">
      {{ uploadError }}
    </p>
    <p v-if="uploadSuccess" class="text-green-600" role="status">
      {{ uploadSuccess }}
    </p>
  </form>
</template>
