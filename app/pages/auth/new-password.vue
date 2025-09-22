<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'New Password',
  })
  useHead({
    title: 'New Password',
  })
</script>

<template>
  <div
    class="px-bleed mx-auto grid w-full items-center justify-center justify-items-center gap-4"
  >
    <FormsResetPassword />
  </div>
</template>
