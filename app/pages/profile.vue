<script setup lang="ts">
  definePageMeta({
    title: 'Profile',
  })
  useHead({
    title: 'Profile',
  })
  const { user } = useSupabaseAuth()
  const { userData, refreshUserData } = useUser()
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
  <div class="grid w-full gap-8">
    <FormsUpdateUser
      v-bind="{ ...userData, userId: user?.id }"
      @data-changed="userData = $event[0]"
    />
  </div>
</template>
