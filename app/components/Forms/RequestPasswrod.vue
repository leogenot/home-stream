<script setup lang="ts">
  import { messages } from '~/utils/messages'

  const { resetPassword } = useSupabaseAuth()

  const email = ref('')
  const message = ref('')
  const hasError = ref<boolean>(false)

  const handleRequest = async () => {
    message.value = ''

    const { error } = await resetPassword(email.value)

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
      <button aria-label="Request new password" type="submit" class="w-full">
        Request
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
