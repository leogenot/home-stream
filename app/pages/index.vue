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
  <div class="relative z-10 max-w-screen-sm">
    <p v-if="user" class="">Hi {{ user.user_metadata.first_name }}</p>
    <p v-else class="">unauthenticated</p>
    <h1 class="">
      Nuxt3 + Supabase
      <br />
      Starter Template
    </h1>
    <p class="">
      Authentication template with email and password, using Supabase. If you
      want to a quick start to your next Nuxt3 app, please feel free to use this
      template.
    </p>
    <div v-if="user" class="">
      <button class="" :disabled="loading" @click="logout">
        <span class="" :class="{ loading: loading }">Log out</span>
      </button>
    </div>
    <div v-else class="">
      <NuxtLink class="" to="/login">
        <span class="">Login</span>
      </NuxtLink>
      <NuxtLink to="/register">
        <button class="">
          <span class="">Sign up</span>
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
