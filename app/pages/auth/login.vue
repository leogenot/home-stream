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

      <UButton
        aria-label="Go create account"
        to="/auth/register"
        type="submit"
        color="neutral"
        variant="outline"
        size="sm"
        class="w-full justify-center p-2 text-center uppercase"
      >
        Create account
      </UButton>
    </div>
  </div>
</template>
