<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })
  useHead({
    title: 'Forgot Password | supaAuth',
  })
  const email = ref('')
  const client = useSupabaseClient()
  const loading = ref(false)
  const authSuccess = ref('')
  const authError = ref('')

  const resetPassword = async () => {
    loading.value = true
    const { error } = await client.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/new-password`,
    })
    if (error) {
      loading.value = false
      authError.value = error.message
      setTimeout(() => {
        authError.value = ''
      }, 5000)
    } else {
      loading.value = false
      authSuccess.value = `We've sent your an email.`
      setTimeout(() => {
        authSuccess.value = ''
      }, 5000)
    }
  }

  const clearError = () => {
    authError.value = ''
  }

  const clearSuccess = () => {
    authSuccess.value = ''
  }
</script>

<template>
  <div class="">
    <h1 class="">Forgot password</h1>
    <form @submit.prevent="resetPassword">
      <ErrorAlert :error-msg="authError" @clear-error="clearError" />
      <SuccessAlert :success-msg="authSuccess" @clear-success="clearSuccess" />
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
      </div>
      <button class="" type="submit" :disabled="loading">
        <div class="" :class="{ loading: loading }">Request</div>
      </button>
    </form>
  </div>
</template>
