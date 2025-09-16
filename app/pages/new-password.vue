<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })
  useHead({
    title: 'New Password | supaAuth',
  })
  const password = ref('')
  const passwordConfirm = ref('')
  const client = useSupabaseClient()
  const loading = ref(false)
  const authSuccess = ref('')
  const authError = ref('')

  const updatepassword = async () => {
    if (password.value !== passwordConfirm.value)
      return (authError.value = 'Password mismatch!')
    loading.value = true
    const { error } = await client.auth.updateUser({
      password: password.value,
    })
    await client.auth.signOut()
    if (error) {
      loading.value = false
      authError.value = error.message
      setTimeout(() => {
        authError.value = ''
      }, 5000)
    } else {
      loading.value = false
      authSuccess.value = `Password changed`
      setTimeout(() => {
        authSuccess.value = ''
        navigateTo('/login')
      }, 5000)
    }
  }

  const clearError = () => {
    authError.value = ''
  }

  const clearSuccess = () => {
    authSuccess.value = ''
    navigateTo('/login')
  }
</script>

<template>
  <div class="">
    <h1 class="">New password</h1>
    <form @submit.prevent="updatepassword">
      <ErrorAlert :error-msg="authError" @clear-error="clearError" />
      <SuccessAlert :success-msg="authSuccess" @clear-success="clearSuccess" />
      <div class="">
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
        <label class="">
          <div class="">
            <input
              v-model="passwordConfirm"
              class=""
              type="password"
              placeholder="Repeat"
            />
          </div>
        </label>
      </div>
      <div class="">
        <button class="" type="submit" :disabled="loading">
          <div class="" :class="{ loading: loading }">Save</div>
        </button>
      </div>
    </form>
  </div>
</template>
