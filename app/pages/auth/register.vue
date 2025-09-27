<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'Create account',
    middleware: 'guest'
  })
  useHead({
    title: 'Create account',
  })
</script>

<template>
  <div class="grid w-full gap-4">
    <FormsSignup />
  </div>
</template>
