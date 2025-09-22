<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })
  useHead({
    title: 'Forgot Password',
  })
</script>

<template>
  <div
    class="px-bleed mx-auto grid w-full items-center justify-center justify-items-center gap-4"
  >
    <h1 class="font-serif text-3xl">Forgot password</h1>
    <FormsRequestPassword />
  </div>
</template>
