<script setup lang="ts">
  useHead({
    title: 'Upload',
  })
  definePageMeta({
    title: 'Upload',
  })
  const { user } = useSupabaseAuth()
  const { refreshUserData } = useUser()
  const router = useRouter()

  onMounted(() => {
    if (user.value) {
      // Refresh user data to ensure subscription status is current
      refreshUserData()
    } else {
      router.push('/auth/login')
    }
  })
</script>

<template>
  <div class="w-full">
    <upload-wrapper />
  </div>
</template>
