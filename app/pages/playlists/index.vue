<script setup lang="ts">
  import { useHead } from 'nuxt/app'
  useHead({ title: 'Playlists' })
</script>

<template>
  <div class="px-bleed mx-auto grid w-full gap-8">
    <FormsPlaylist />
    <PlaylistList />
    <upload />
  </div>
</template>
