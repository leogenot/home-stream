<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })
  useHead({
    title: 'New Password',
  })
</script>

<template>
  <div
    class="px-bleed mx-auto grid w-full items-center justify-center justify-items-center gap-4"
  >
    <h1 class="font-serif text-3xl">New password</h1>
    <FormsResetPassword />
  </div>
</template>
