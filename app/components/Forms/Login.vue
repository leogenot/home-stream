<script setup lang="ts">
  const { signInWithEmail, isLoading } = useSupabaseAuth()
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const message = ref('')
  const hasError = ref<boolean>(false)
  // const isLoading = ref<boolean>(false)

  const handleLogin = async () => {
    message.value = ''

    const { error } = await signInWithEmail(email.value, password.value)

    hasError.value = !!error

    if (error) {
      message.value = error
    } else {
      router.push('/profile')
    }
  }
</script>

<template>
  <div class="relative pb-1">
    <form class="font-sans uppercase" @submit.prevent="handleLogin">
      <CommonInput
        v-bind="{
          modelValue: email,
          type: 'email',
          id: 'email',
          name: 'email',
          autocomplete: 'username',
          required: true,
          label: 'Email',
        }"
        @update:model-value="($event) => (email = $event)"
      />
      <CommonInput
        v-bind="{
          modelValue: password,
          type: 'password',
          id: 'password',
          name: 'password',
          autocomplete: 'current-password',
          required: true,
          label: 'Password',
        }"
        @update:model-value="($event) => (password = $event)"
      />
      <button type="submit" aria-label="Submit to log in" class="w-full">
        Log in
      </button>

      <p
        v-if="message"
        class="text-legal mt-2 normal-case"
        :class="hasError ? 'text-red-500' : 'text-green-500'"
      >
        {{ message }}
      </p>

      <div class="relative mt-5 flex justify-center">
        <nuxt-link to="/forgot-password" aria-label="Forgot password">
          Forgot password?
        </nuxt-link>
      </div>
    </form>
  </div>
</template>
