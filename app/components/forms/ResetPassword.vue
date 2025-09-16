<script setup lang="ts">
  import { messages } from '~/utils/messages'

  const { updatePassword } = useSupabaseAuth()

  const password = ref('')
  const confirmPassword = ref('')
  const message = ref('')
  const hasError = ref<boolean>(false)

  const handleRequest = async () => {
    message.value = ''

    if (confirmPassword.value != password.value) {
      hasError.value = true
      message.value = messages.error.passwordsNotMatching
      return
    }

    const { result, error } = await updatePassword(password.value)

    console.log('result ', result)

    hasError.value = !!error

    if (error) {
      console.log('error ', error)
      message.value = error
    } else {
      console.log('no error')
      message.value = messages.success.passwordUpdated
    }
  }

  const btnDisabled = computed(() => !password.value && !confirmPassword.value)
</script>

<template>
  <div>
    <h4 class="mb-5 text-sm font-medium uppercase">Password change</h4>
    <form class="font-sans uppercase" @submit.prevent="handleRequest">
      <CommonInput
        @update:modelValue="($event) => (password = $event)"
        v-bind="{
          modelValue: password,
          type: 'password',
          id: 'password',
          name: 'password',
          autocomplete: 'off',
          required: true,
          label: 'New password',
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
          label: 'Confirm new password',
        }"
      />
      <ElementsButton
        ariaLabel="Reset password"
        btnType="submit"
        class="w-full"
        :disabled="btnDisabled"
      >
        Reset password
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
