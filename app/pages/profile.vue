<script setup lang="ts">
  definePageMeta({
    title: 'Profile',
    middleware: 'auth',
  })
  useSeoMeta({
    title: 'Profile',
    description:
      'Manage your Home Stream profile settings and account information.',
    ogTitle: 'Profile - Home Stream',
    ogDescription:
      'Manage your Home Stream profile settings and account information.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    twitterCard: 'summary',
    twitterTitle: 'Profile - Home Stream',
    twitterDescription:
      'Manage your Home Stream profile settings and account information.',
  })
  const { user } = useSupabaseAuth()
  const { userData, refreshUserData } = useUser()

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })
</script>

<template>
  <div class="grid w-full gap-4">
    <h1 class="font-serif text-2xl">Hi {{ userData?.username }}</h1>
    <USeparator />

    <FormsUpdateUser
      v-bind="{ ...userData, userId: user?.id }"
      @data-changed="userData = $event[0]"
    />
  </div>
</template>
