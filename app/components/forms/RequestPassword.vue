<script setup lang="ts">
  import { messages } from '~/utils/messages'

  const { resetPassword } = useSupabaseAuth()

  const email = ref('')
  const message = ref('')
  const hasError = ref<boolean>(false)

  const handleRequest = async () => {
    message.value = ''

    const { data, error } = await resetPassword(email.value)

    hasError.value = !!error

    if (error) {
      message.value = error
    } else {
      message.value = messages.success.requestSuccess
    }
  }
</script>

<template>
  <div class="f-request-password">
    <h1 class="mb-5 text-sm font-medium uppercase">Request new password</h1>
    <form class="font-sans uppercase" @submit.prevent="handleRequest">
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
      <ElementsButton
        ariaLabel="Request new password"
        btnType="submit"
        class="w-full"
      >
        Request
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
