<script setup lang="ts">
  defineProps<{ successMsg: string }>()
  const emit = defineEmits(['clearSuccess'])
  const clearSuccess = () => {
    emit('clearSuccess')
  }
</script>

<template>
  <div v-if="successMsg">
    <div class="">Success!</div>
    <p class="">{{ successMsg }}</p>
    <div class="" @click="clearSuccess">Clear success</div>
  </div>
</template>
