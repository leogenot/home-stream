<script setup lang="ts">
  useHead({
    title: 'Home Strem',
  })

  const { signOut } = useSupabaseAuth()
  const { userData } = useUser()
  const { forceRefreshUserData } = useUser()
  const router = useRouter()

  onMounted(() => {
    console.log('userData', userData.value)
    if (userData.value) {
      // Refresh user data to ensure subscription status is current
      forceRefreshUserData()
    } else {
      // router.push('/auth/login')
    }
  })
</script>

<template>
  <div
    class="px-bleed mx-auto grid w-full items-center justify-center justify-items-center gap-4"
  >
    <nuxt-link v-if="userData" to="/profile" class="font-serif text-3xl">
      Hi {{ userData.username }}
    </nuxt-link>
    <p v-else class="font-serif text-3xl">unauthenticated</p>
    <div v-if="userData" class="">
      <button
        class="cursor-pointer border border-(--sand) p-2 uppercase"
        @click="signOut"
      >
        <span>Log out</span>
      </button>
    </div>
    <div v-else class="grid w-fit items-center justify-between gap-4">
      <NuxtLink class="border border-(--sand) p-2 uppercase" to="/auth/login">
        Login
      </NuxtLink>
      <NuxtLink
        class="border border-(--sand) p-2 uppercase"
        to="/auth/register"
      >
        Sign up
      </NuxtLink>
    </div>
  </div>
</template>
