<script setup lang="ts">
  useHead({
    title: 'Upload',
  })
  definePageMeta({
    title: 'Upload',
    middleware: 'auth',
  })
  const { refreshUserData } = useUser()

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })
</script>

<template>
  <div class="grid w-full gap-6">
    <div>
      <h2 class="font-serif text-2xl">Upload</h2>
    </div>
    <div class="grid w-full gap-8">
      <FormsUpload />
      <UploadList />
    </div>
  </div>
</template>
