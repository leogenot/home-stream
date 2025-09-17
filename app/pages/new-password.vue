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
  <div
    class="mx-auto grid w-fit items-center justify-center justify-items-center gap-4"
  >
    <h1 class="font-serif text-3xl">New password</h1>
    <form
      class="grid w-fit items-center justify-between gap-4"
      @submit.prevent="updatepassword"
    >
      <ErrorAlert :error-msg="authError" @clear-error="clearError" />
      <SuccessAlert :success-msg="authSuccess" @clear-success="clearSuccess" />
      <div class="">
        <label class="">
          <input
            v-model="password"
            class="border border-(--sand) p-2 uppercase"
            type="password"
            placeholder="Password"
          />
        </label>
        <label class="">
          <input
            v-model="passwordConfirm"
            class="border border-(--sand) p-2 uppercase"
            type="password"
            placeholder="Repeat"
          />
        </label>
      </div>
      <button
        class="cursor-pointer border border-(--sand) p-2 uppercase"
        type="submit"
        :disabled="loading"
      >
        <div class="" :class="{ 'pointer-events-none opacity-50': loading }">
          Save
        </div>
      </button>
      <NuxtLink
        class="border border-(--sand) p-2 text-center uppercase"
        to="/login"
      >
        Login
      </NuxtLink>
    </form>
  </div>
</template>
