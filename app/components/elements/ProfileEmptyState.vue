<script setup lang="ts">
  const _props = defineProps<{
    title?: string
    body?: string
    callToAction?: CallToActionProps
  }>()
</script>
<template>
  <div class="py-25">
    <div
      class="e-profile empty-state flex flex-col items-center justify-center text-center"
    >
      <h2 class="mb-6 font-serif text-2xl">{{ title }}</h2>
      <p class="mb-10 block font-serif text-base">{{ body }}</p>
      <ElementsLink v-bind="callToAction" :underline="true" />
    </div>
  </div>
</template>
