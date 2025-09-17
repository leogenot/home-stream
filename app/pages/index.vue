<script setup lang="ts">
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const loading = ref(false)

  const logout = async () => {
    loading.value = true
    const { error } = await client.auth.signOut()
    if (error) {
      loading.value = false
      return alert('Something went wrong !')
    }
  }

  useHead({
    title: 'supaAuth',
    meta: [
      {
        name: 'description',
        content:
          'Authentication template with email and password, using Supabase. If you want to a quick start to your next Nuxt3 app, please feel free to use this template.',
      },
    ],
  })
</script>

<template>
  <div
    class="mx-auto grid w-fit items-center justify-center justify-items-center gap-4"
  >
    <nuxt-link v-if="user" to="/profile" class="font-serif text-3xl">
      Hi {{ user.user_metadata.full_name }}
    </nuxt-link>
    <p v-else class="font-serif text-3xl">unauthenticated</p>
    <div v-if="user" class="">
      <button
        class="cursor-pointer border border-(--sand) p-2 uppercase"
        :disabled="loading"
        @click="logout"
      >
        <span class="" :class="{ 'pointer-events-none opacity-50': loading }">
          Log out
        </span>
      </button>
    </div>
    <div v-else class="grid w-fit items-center justify-between gap-4">
      <NuxtLink class="border border-(--sand) p-2 uppercase" to="/login">
        Login
      </NuxtLink>
      <NuxtLink class="border border-(--sand) p-2 uppercase" to="/register">
        Sign up
      </NuxtLink>
    </div>
  </div>
</template>
