<script setup lang="ts">
  useHead({
    title: 'Upload',
  })
  definePageMeta({
    title: 'Upload',
    middleware: 'auth'
  })
  const { refreshUserData } = useUser()

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })
</script>

<template>
  <div class="w-full">
    <upload-wrapper />
  </div>
</template>
