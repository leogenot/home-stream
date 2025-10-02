<script setup lang="ts">
  useSeoMeta({
    title: 'Upload Music',
    description:
      'Upload your music files to Home Stream. Add new songs to your personal music library and start streaming immediately.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    ogTitle: 'Upload Music - Home Stream',
    ogDescription:
      'Upload your music files to Home Stream and build your personal music library.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Upload Music - Home Stream',
    twitterDescription:
      'Upload your music files to Home Stream and build your personal music library.',
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
  <div class="grid w-full gap-4">
    <div>
      <h2 class="font-serif text-2xl">Upload</h2>
    </div>
    <USeparator />

    <div class="grid w-full gap-8">
      <FormsUpload />
      <UploadList />
    </div>
  </div>
</template>
