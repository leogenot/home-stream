<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'Login',
    middleware: 'guest',
  })
  useSeoMeta({
    title: 'Login',
    description:
      'Sign in to your Home Stream account to access your personal music library and playlists.',
    ogTitle: 'Login - Home Stream',
    ogDescription:
      'Sign in to your Home Stream account to access your personal music library.',
    ogType: 'website',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    twitterCard: 'summary',
    twitterTitle: 'Login - Home Stream',
    twitterDescription:
      'Sign in to your Home Stream account to access your personal music library.',
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
