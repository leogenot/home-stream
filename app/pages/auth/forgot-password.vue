<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'Forgot Password',
  })
  useHead({
    title: 'Forgot Password',
  })
</script>

<template>
  <div class="grid w-full gap-4">
    <FormsRequestPassword />
  </div>
</template>
