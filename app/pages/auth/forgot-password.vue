<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'Forgot Password',
    middleware: 'guest',
  })
  useSeoMeta({
    title: 'Forgot Password',
    description:
      'Reset your Home Stream password. Enter your email address to receive password reset instructions.',
    ogTitle: 'Forgot Password - Home Stream',
    ogDescription: 'Reset your Home Stream password with email instructions.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    twitterCard: 'summary',
    twitterTitle: 'Forgot Password - Home Stream',
    twitterDescription:
      'Reset your Home Stream password with email instructions.',
  })
</script>

<template>
  <div class="grid w-full gap-4">
    <FormsRequestPassword />
  </div>
</template>
