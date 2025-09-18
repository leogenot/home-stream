<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })
  useHead({
    title: 'Register',
  })
</script>

<template>
  <div
    class="mx-auto grid w-fit items-center justify-center justify-items-center gap-4"
  >
    <h1 class="font-serif text-3xl">Create an account</h1>
    <FormsSignup />
  </div>
</template>
