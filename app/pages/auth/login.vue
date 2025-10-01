<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'Login',
    middleware: 'guest',
  })
  useHead({
    title: 'Login',
  })
</script>

<template>
  <div class="grid w-full gap-4">
    <FormsLogin />
    <div class="grid w-full gap-4 text-center">
      <p class="text-sm">Don't have an account?</p>
      <NuxtLink
        class="border-default border p-2 text-center text-sm uppercase"
        to="/auth/register"
      >
        Create new account
      </NuxtLink>
    </div>
  </div>
</template>
