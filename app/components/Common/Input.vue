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
      :placeholder="name"
      class="peer w-full border border-(--sand) p-2 text-sm focus:text-black focus:outline-none"
      @input="emit('update:modelValue', $event.target.value)"
    />

    <button
      v-if="type === 'password'"
      type="button"
      class="absolute right-0 bottom-2 text-xs text-black/50 focus:outline-none"
      @click="toggleVisibility"
    >
      <span class="text-xxs flex">
        <span v-if="isPasswordVisible" class="icon">hide</span>
        <span v-else class="icon">show</span>
      </span>
    </button>
  </div>
</template>
