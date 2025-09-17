<script setup lang="ts">
  defineProps<{ errorMsg: string }>()
  const emit = defineEmits(['clearError'])
  const clearError = () => {
    emit('clearError')
  }
</script>
<template>
  <div v-if="errorMsg">
    <p class="">{{ errorMsg }}</p>
    <div class="" @click="clearError">Clear errors</div>
  </div>
</template>
