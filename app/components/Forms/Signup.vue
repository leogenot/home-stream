<script setup lang="ts">
  import { messages } from '~/utils/messages'

  const { signUpNewUser } = useSupabaseAuth()
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const message = ref('')
  const hasError = ref<boolean>(false)

  const handleSignUp = async () => {
    message.value = ''

    if (confirmPassword.value != password.value) {
      hasError.value = true
      message.value = messages.error.passwordsNotMatching
      return
    }

    const { error } = await signUpNewUser(email.value, password.value)

    hasError.value = !!error

    if (error) {
      message.value = error
    } else {
      message.value = messages.success.signupSuccess
    }
  }
</script>

<template>
  <div>
    <form class="font-sans uppercase" @submit.prevent="handleSignUp">
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
          autocomplete: 'off',
          required: true,
          label: 'Password',
        }"
        @update:model-value="($event) => (password = $event)"
      />
      <CommonInput
        v-bind="{
          modelValue: confirmPassword,
          type: 'password',
          id: 'confirmPassword',
          name: 'confirmPassword',
          autocomplete: 'off',
          required: true,
          label: 'Confirm password',
        }"
        @update:model-value="($event) => (confirmPassword = $event)"
      />
      <button type="submit" aria-label="Submit to signup" class="w-full">
        Sign up
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
