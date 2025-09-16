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
  <div class="">
    <h1 class="">Sign in</h1>
    <form @submit.prevent="login">
      <ErrorAlert :error-msg="authError" @clear-error="clearError" />
      <div class="">
        <label class="">
          <div class="">
            <input
              v-model="email"
              class=""
              type="text"
              placeholder="Email address"
            />
          </div>
        </label>
        <label class="">
          <div class="">
            <input
              v-model="password"
              class=""
              type="password"
              placeholder="Password"
            />
          </div>
        </label>
      </div>
      <div class="">
        <button class="" type="submit" :disabled="loading">
          <div class="" :class="{ loading: loading }">Sign in</div>
        </button>
        <NuxtLink to="/forgot-password" class="">
          Forgot your password?
        </NuxtLink>
      </div>
    </form>
    <div class="">
      <p class="">Don’t have a SupaAuth account?</p>
      <NuxtLink to="/register">
        <button class="">
          <div class="">Create new account</div>
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
