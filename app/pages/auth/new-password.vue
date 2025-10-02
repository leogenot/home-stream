<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'New Password',
    middleware: 'guest',
  })
  useSeoMeta({
    title: 'Set New Password',
    description:
      'Set a new password for your Home Stream account. Complete your password reset process.',
    ogTitle: 'Set New Password - Home Stream',
    ogDescription: 'Set a new password for your Home Stream account.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    twitterCard: 'summary',
    twitterTitle: 'Set New Password - Home Stream',
    twitterDescription: 'Set a new password for your Home Stream account.',
  })
</script>

<template>
  <div
    class="px-bleed mx-auto grid w-full items-center justify-center justify-items-center gap-4"
  >
    <FormsResetPassword />
  </div>
</template>
