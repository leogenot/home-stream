<script setup>
  const { user } = useSupabaseAuth()
  const router = useRouter()

  const { userData, refreshUserData } = useUser()

  onMounted(() => {
    if (user.value) {
      // Refresh user data to ensure subscription status is current
      refreshUserData()
    } else {
      router.push('/account/login')
    }
  })
</script>

<template>
  <div v-if="user" class="flex min-h-screen flex-col justify-between">
    <div>
      <div class="grid gap-15 pt-10 pb-40">
        <FormsUpdateUser
          v-bind="{ ...userData, userId: user.id }"
          @data-changed="userData = $event[0]"
        />
        <FormsResetPassword />
      </div>
    </div>
    <SiteFooter />
  </div>
</template>
