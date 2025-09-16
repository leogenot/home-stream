<script setup lang="ts">
  defineProps<{ errorMsg: string }>()
  const emit = defineEmits(['clearError'])
  const clearError = () => {
    emit('clearError')
  }
</script>
<template>
  <Transition name="scale-y">
    <div v-if="errorMsg">
      <div class="">
        <p class="">{{ errorMsg }}</p>
        <div class="">
          <div class="" @click="clearError">Clear errors</div>
        </div>
      </div>
    </div>
  </Transition>
</template>
