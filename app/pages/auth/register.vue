<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'Create account',
    middleware: 'guest',
  })
  useSeoMeta({
    title: 'Create Account',
    description:
      'Create your Home Stream account to start building your personal music library. Upload, organize, and stream your music collection.',
    ogTitle: 'Create Account - Home Stream',
    ogDescription:
      'Create your Home Stream account to start building your personal music library.',
    ogType: 'website',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    twitterCard: 'summary',
    twitterTitle: 'Create Account - Home Stream',
    twitterDescription:
      'Create your Home Stream account to start building your personal music library.',
  })
</script>

<template>
  <div class="grid w-full gap-4">
    <FormsSignup />
  </div>
</template>
