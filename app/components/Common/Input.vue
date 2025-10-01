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
    <UInput
      :id="id"
      :value="modelValue"
      :type="inputType"
      :name="name"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="name"
      :ui="{ trailing: 'pe-1' }"
      class="peer w-full text-sm focus:outline-none"
      @input="emit('update:modelValue', $event.target.value)"
    >
      <template v-if="type === 'password'" #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="isPasswordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
          :aria-pressed="isPasswordVisible"
          aria-controls="password"
          @click="toggleVisibility"
        />
      </template>
    </UInput>
  </div>
</template>
