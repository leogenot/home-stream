<script setup lang="ts">
  const { signInWithEmail } = useSupabaseAuth()
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const message = ref('')
  const hasError = ref<boolean>(false)

  const handleLogin = async () => {
    message.value = ''

    const { error } = await signInWithEmail(email.value, password.value)

    hasError.value = !!error

    if (error) {
      message.value = error
    } else {
      router.push('/')
    }
  }
</script>

<template>
  <div class="relative w-full text-sm">
    <form class="font-sans" @submit.prevent="handleLogin">
      <CommonInput
        v-bind="{
          modelValue: email,
          type: 'email',
          id: 'email',
          name: 'Email',
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
          name: 'Password',
          autocomplete: 'current-password',
          required: true,
          label: 'Password',
        }"
        @update:model-value="($event) => (password = $event)"
      />
      <div class="relative mt-5 flex justify-center uppercase">
        <nuxt-link
          to="/auth/forgot-password"
          aria-label="Forgot password"
          class="text-xs"
        >
          Forgot password?
        </nuxt-link>
      </div>
      <button
        type="submit"
        aria-label="Submit to log in"
        class="mt-5 w-full border border-(--sand) p-2 text-center uppercase"
      >
        Log in
      </button>

      <p
        v-if="message"
        class="text-legal mt-2 normal-case"
        :class="hasError ? 'text-red-500' : 'text-green-500'"
      >
        {{ message }}
      </p>
    </form>
  </div>
</template>
