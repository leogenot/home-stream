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
  <div
    class="mx-auto grid w-fit items-center justify-center justify-items-center gap-4"
  >
    <h1 class="font-serif text-3xl">Create an account</h1>
    <form
      class="grid w-fit items-center justify-between gap-4"
      @submit.prevent="signUp"
    >
      <ErrorAlert :error-msg="authError" @clear-error="clearError" />
      <label class="">
        <input
          v-model="name"
          class="border border-(--sand) p-2 uppercase"
          type="text"
          placeholder="First name"
        />
      </label>
      <label class="">
        <input
          v-model="lastname"
          class="border border-(--sand) p-2 uppercase"
          type="text"
          placeholder="Last name"
        />
      </label>
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
      <button
        class="cursor-pointer border border-(--sand) p-2 uppercase"
        type="submit"
        :disabled="loading"
      >
        <div :class="{ 'pointer-events-none opacity-50': loading }">
          Sign up
        </div>
      </button>
      <div class="grid items-center justify-between justify-items-center gap-4">
        <p class="">I already have an account:</p>
        <NuxtLink
          class="border border-(--sand) p-2 text-center uppercase"
          to="/login"
        >
          Login
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
