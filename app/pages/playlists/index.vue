<script setup lang="ts">
  import { useHead } from 'nuxt/app'
  useHead({ title: 'Playlists' })
  definePageMeta({
    title: 'Playlists',
  })
</script>

<template>
  <div class="grid w-full gap-8">
    <FormsPlaylist />
    <PlaylistList />
    <upload-wrapper />
  </div>
</template>
