<script setup lang="ts">
  import { messages } from '~/utils/messages'

  const { upsertUserDetails } = useSupabaseAuth()
  const emit = defineEmits(['dataChanged'])

  type Props = {
    userId: string
    display_name?: string
    email?: string
    firstname?: string
    lastname?: string
  }

  const _props = defineProps<Props>()

  const name = ref(_props.firstname)
  const familyName = ref(_props.lastname)
  const message = ref<string | null | undefined>('')
  const hasError = ref<boolean>(false)

  const updateUser = async () => {
    const { data, error } = await upsertUserDetails(
      _props.userId,
      name.value,
      familyName.value,
    )

    console.log('DATA', data, 'ERROR', error)

    hasError.value = !!error

    if (error) {
      message.value = error
    } else {
      emit('dataChanged', data)
      message.value = messages.success.userUpdated
    }
  }

  const btnDisabled = computed(
    () => _props.firstname == name.value && _props.lastname == familyName.value,
  )
</script>

<template>
  <div class="">
    <h4 class="font-serif text-2xl">Profile settings</h4>
    <form class="font-sans uppercase" @submit.prevent="updateUser">
      <fieldset class="gap-gap grid lg:grid-cols-2">
        <CommonInput
          @update:modelValue="($event) => (name = $event)"
          v-bind="{
            modelValue: name,
            type: 'text',
            id: 'name',
            name: 'name',
            autocomplete: 'given-name',
            required: false,
            label: 'First name',
          }"
        />
        <CommonInput
          @update:modelValue="($event) => (familyName = $event)"
          v-bind="{
            modelValue: familyName,
            type: 'text',
            id: 'familyName',
            name: 'familyName',
            autocomplete: 'family-name',
            required: false,
            label: 'Last name',
          }"
        />
      </fieldset>

      <ElementsButton
        btnType="submit"
        class="w-full"
        ariaLabel="Save changes"
        :disabled="btnDisabled"
      >
        Save changes
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
