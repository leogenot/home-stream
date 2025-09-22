<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
  })
  useHead({
    title: 'Login',
  })
</script>

<template>
  <div
    class="px-bleed mx-auto grid w-full items-center justify-center justify-items-center gap-4"
  >
    <h1 class="font-serif text-3xl">Sign in</h1>
    <FormsLogin />
    <div class="grid items-center justify-between justify-items-center gap-4">
      <p class="">Don't have a SupaAuth account?</p>
      <NuxtLink
        class="border border-(--sand) p-2 text-center uppercase"
        to="/register"
      >
        Create new account
      </NuxtLink>
    </div>
  </div>
</template>
