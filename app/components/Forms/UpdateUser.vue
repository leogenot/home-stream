<script setup lang="ts">
  import { messages } from '~/utils/messages'

  const { upsertUserDetails } = useSupabaseAuth()
  const emit = defineEmits(['dataChanged'])

  type Props = {
    auth_user_id: string
    display_name?: string
    email?: string
    username?: string
  }

  const _props = defineProps<Props>()

  const username = ref(_props.username)
  const message = ref<string | null | undefined>('')
  const hasError = ref<boolean>(false)

  const updateUser = async () => {
    const { data, error } = await upsertUserDetails(username.value!)

    console.log('DATA', data, 'ERROR', error)

    hasError.value = !!error

    if (error) {
      message.value = error
    } else {
      emit('dataChanged', data)
      message.value = messages.success.userUpdated
    }
  }

  const btnDisabled = computed(() => _props.username == username.value)
</script>

<template>
  <div class="grid gap-2">
    <h4 class="font-serif text-lg">Profile settings</h4>
    <form class="font-sans uppercase" @submit.prevent="updateUser">
      <fieldset class="gap-gap grid lg:grid-cols-2">
        <CommonInput
          v-bind="{
            modelValue: username,
            type: 'text',
            id: 'username',
            name: 'username',
            autocomplete: 'username',
            required: false,
            label: 'Username',
          }"
          @update:model-value="($event) => (username = $event)"
        />
      </fieldset>

      <button
        class="border-default w-full border py-1"
        aria-label="Save changes"
        :disabled="btnDisabled"
      >
        Save changes
      </button>
      <p
        v-if="message"
        class="text-legal mt-2 normal-case"
        :class="hasError ? 'text-red-500' : 'text-gree-500'"
      >
        {{ message }}
      </p>
    </form>
  </div>
</template>
