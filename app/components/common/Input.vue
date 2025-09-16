<script lang="ts" setup>
  import { ref, computed } from 'vue'

  const emit = defineEmits(['update:modelValue'])

  type Props = {
    type: string
    name: string
    id: string
    autocomplete?: string
    required?: boolean
    label: string
    modelValue?: string
  }

  const _props = defineProps<Props>()
  const isPasswordVisible = ref(false)

  const inputType = computed(() => {
    if (_props.type === 'password') {
      return isPasswordVisible.value ? 'text' : 'password'
    }
    return _props.type
  })

  function toggleVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value
  }
</script>

<template>
  <div class="relative mb-4">
    <input
      :id="id"
      :value="modelValue"
      :type="inputType"
      :name="name"
      :autocomplete="autocomplete"
      :required="required"
      placeholder=" "
      class="peer w-full border-b pt-6 pr-10 pb-2 text-sm font-medium text-(--black)/50 placeholder-transparent focus:text-(--black) focus:outline-none"
      @input="
        emit(
          'update:modelValue',
          ($event.target as HTMLInputElement)?.value ?? '',
        )
      "
    />

    <label
      :for="id"
      class="text-xxs peer-focus:text-xxs absolute top-2 left-0 text-(--black)/50 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-(--black)/50 peer-focus:top-2 peer-focus:text-(--black)/50"
    >
      {{ label }}
    </label>

    <button
      v-if="type === 'password'"
      type="button"
      class="absolute right-0 bottom-2 text-xs text-(--black)/50 focus:outline-none"
      @click="toggleVisibility"
    >
      <span class="flex size-5">
        <IconsEyeOpen v-if="isPasswordVisible" />
        <IconsEyeClose v-else />
      </span>
    </button>
  </div>
</template>
