<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })
  useHead({
    title: 'Login | supaAuth',
  })
  const user = useSupabaseUser()
  const loading = ref(false)
  const authError = ref('')
  const email = ref('')
  const password = ref('')
  const client = useSupabaseClient()

  watchEffect(async () => {
    if (user.value) {
      await navigateTo('/')
    }
  })

  const login = async () => {
    loading.value = true
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) {
      loading.value = false
      authError.value = error.message
      setTimeout(() => {
        authError.value = ''
      }, 5000)
    }
  }

  const clearError = () => {
    authError.value = ''
  }
</script>

<template>
  <div
    class="mx-auto grid w-fit items-center justify-center justify-items-center gap-4"
  >
    <h1 class="font-serif text-3xl">Sign in</h1>
    <form
      class="grid items-center justify-between justify-items-center gap-4"
      @submit.prevent="login"
    >
      <ErrorAlert :error-msg="authError" @clear-error="clearError" />
      <div class="grid items-center justify-between justify-items-center gap-4">
        <label class="">
          <input
            v-model="email"
            class="border border-(--sand) p-2 uppercase"
            type="text"
            placeholder="Email address"
          />
        </label>
        <label class="">
          <input
            v-model="password"
            class="border border-(--sand) p-2 uppercase"
            type="password"
            placeholder="Password"
          />
        </label>
      </div>
      <div class="grid items-center justify-between justify-items-center gap-4">
        <button
          class="cursor-pointer border border-(--sand) p-2 uppercase"
          type="submit"
          :disabled="loading"
        >
          <div :class="{ 'pointer-events-none opacity-50': loading }">
            Sign in
          </div>
        </button>
        <NuxtLink to="/forgot-password" class="">
          Forgot your password?
        </NuxtLink>
      </div>
    </form>
    <div class="grid items-center justify-between justify-items-center gap-4">
      <p class="">Don't have a SupaAuth account?</p>
      <NuxtLink
        class="border border-(--sand) p-2 text-center uppercase"
        to="/register"
      >
        Create new account
      </NuxtLink>
    </div>
  </div>
</template>
