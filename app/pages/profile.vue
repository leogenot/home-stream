<script setup lang="ts">
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
      router.push('/login')
    }
  })
</script>

<template>
  <div class="mx-auto grid w-fit gap-8">
    <FormsUpdateUser
      v-bind="{ ...userData, userId: user?.id }"
      @data-changed="userData = $event[0]"
    />
    <FormsResetPassword />
  </div>
</template>
