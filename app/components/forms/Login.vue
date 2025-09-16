<script setup lang="ts">
  import { useSupabaseAuth } from '~/composables/useSupabaseAuth'
  const { signInWithEmail, isLoading } = useSupabaseAuth()
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
      router.push('/account/profile')
    }
  }

  const handleGoogleLogin = async () => {
    const result = await signInWithEmail(email.value, password.value)
    if (result && result.error) {
      message.value = result.error
    }
  }
</script>

<template>
  <div class="relative pb-1">
    <div
      v-if="isLoading"
      class="absolute z-20 flex h-full w-full items-center justify-center bg-(--white)/80"
    >
      <ElementsLoader />
    </div>

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
      <ElementsButton
        btn-type="submit"
        aria-label="Submit to log in"
        class="w-full"
      >
        Log in
      </ElementsButton>

      <p
        v-if="message"
        class="text-legal mt-2 normal-case"
        :class="hasError ? 'text-(--red)' : 'text-(--green)'"
      >
        {{ message }}
      </p>

      <div class="relative mt-5 flex justify-center">
        <ElementsLink
          title="Forgot password?"
          url="/account/request-password"
          :underline="true"
        />
      </div>
    </form>
  </div>
</template>
