<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })
  useHead({
    title: 'Register | supaAuth',
  })
  const email = ref('')
  const password = ref('')
  const name = ref('')
  const lastname = ref('')
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const loading = ref(false)
  const authError = ref('')

  watchEffect(async () => {
    if (user.value) {
      await navigateTo('/')
    }
  })

  const signUp = async () => {
    if (!name.value) return (authError.value = 'First name required')
    if (!lastname.value) return (authError.value = 'Last name required')
    loading.value = true
    const { error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          first_name: name.value,
          last_name: lastname.value,
        },
      },
    })
    if (error) {
      loading.value = false
      authError.value = 'Failed to fetch'
    }
  }

  const clearError = () => {
    authError.value = ''
  }
</script>

<template>
  <div class="">
    <h1 class="">Create an account</h1>
    <form @submit.prevent="signUp">
      <ErrorAlert :error-msg="authError" @clear-error="clearError" />
      <div class="">
        <label class="">
          <div class="">
            <input
              v-model="name"
              class=""
              type="text"
              placeholder="First name"
            />
          </div>
        </label>
        <label class="">
          <div class="">
            <input
              v-model="lastname"
              class=""
              type="text"
              placeholder="Last name"
            />
          </div>
        </label>
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
          <div class="" :class="{ loading: loading }">Sign up</div>
        </button>
        <div class="">
          By signing up you agree to our
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            class=""
          >
            <span>API Terms of Service</span>
          </a>
          and
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            class=""
          >
            <span>Privacy Policy</span>
          </a>
          .
        </div>
      </div>
    </form>
  </div>
</template>
