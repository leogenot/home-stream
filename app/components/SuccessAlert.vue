<script setup lang="ts">
  defineProps<{ successMsg: string }>()
  const emit = defineEmits(['clearSuccess'])
  const clearSuccess = () => {
    emit('clearSuccess')
  }
</script>

<template>
  <Transition name="scale-y">
    <div v-if="successMsg">
      <div class="">
        <div class="">Success!</div>
        <p class="">{{ successMsg }}</p>
        <div class="">
          <div class="" @click="clearSuccess">Clear success</div>
        </div>
      </div>
    </div>
  </Transition>
</template>
