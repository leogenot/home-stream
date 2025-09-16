<script setup lang="ts">
  import { messages } from '~/utils/messages'

  const { signUpNewUser, signInWithOAuth } = useSupabaseAuth()
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const firstName = ref('')
  const lastName = ref('')
  const message = ref('')
  const hasError = ref<Boolean>(false)

  const handleSignUp = async () => {
    message.value = ''

    const { getRecaptchaToken } = useGoogleRecaptcha()

    // Send the form to the API
    const token = await getRecaptchaToken('submit')

    console.log('token', token)

    if (!token) return

    if (confirmPassword.value != password.value) {
      hasError.value = true
      message.value = messages.error.passwordsNotMatching
      return
    }

    const { data, error } = await signUpNewUser(
      email.value,
      password.value,
      firstName.value,
      lastName.value,
    )

    hasError.value = !!error

    if (error) {
      message.value = error
    } else {
      message.value = messages.success.signupSuccess
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await signInWithOAuth('google')

    if (error) {
      message.value = error
    }
  }
</script>

<template>
  <div>
    <ElementsButton
      btnType="button"
      ariaLabel="Sign up with Google"
      class="w-full"
      @click="handleGoogleLogin"
    >
      <IconsGoogle class="size-4" />
      Sign up with Google
    </ElementsButton>

    <div class="my-10 grid grid-cols-[1fr_auto_1fr] items-center">
      <span class="h-px w-full bg-(--black)"></span>
      <span class="mx-5 text-sm uppercase">Or</span>
      <span class="h-px w-full bg-(--black)"></span>
    </div>

    <form class="font-sans uppercase" @submit.prevent="handleSignUp">
      <CommonInput
        @update:modelValue="($event) => (email = $event)"
        v-bind="{
          modelValue: email,
          type: 'email',
          id: 'email',
          name: 'email',
          autocomplete: 'username',
          required: true,
          label: 'Email',
        }"
      />
      <CommonInput
        @update:modelValue="($event) => (password = $event)"
        v-bind="{
          modelValue: password,

          type: 'password',
          id: 'password',
          name: 'password',
          autocomplete: 'off',
          required: true,
          label: 'Password',
        }"
      />
      <CommonInput
        @update:modelValue="($event) => (confirmPassword = $event)"
        v-bind="{
          modelValue: confirmPassword,
          type: 'password',
          id: 'confirmPassword',
          name: 'confirmPassword',
          autocomplete: 'off',
          required: true,
          label: 'Confirm password',
        }"
      />
      <ElementsButton
        btnType="submit"
        ariaLabel="Submit to signup"
        class="w-full"
      >
        Sign up
      </ElementsButton>
      <p
        v-if="message"
        class="text-legal mt-2 normal-case"
        :class="hasError ? 'text-(--red)' : 'text-(--green)'"
      >
        {{ message }}
      </p>
    </form>
  </div>
</template>
