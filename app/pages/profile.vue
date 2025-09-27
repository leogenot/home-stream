<script setup lang="ts">
  definePageMeta({
    title: 'Profile',
    middleware: 'auth'
  })
  useHead({
    title: 'Profile',
  })
  const { user } = useSupabaseAuth()
  const { userData, refreshUserData } = useUser()

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })
</script>

<template>
  <div class="grid w-full gap-8">
    <h1 class="font-serif text-xl">Hi {{ userData?.username }}</h1>
    <FormsUpdateUser
      v-bind="{ ...userData, userId: user?.id }"
      @data-changed="userData = $event[0]"
    />
  </div>
</template>
