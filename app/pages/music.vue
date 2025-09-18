<script setup lang="ts">
  useHead({
    title: 'Music',
  })
  const { musics } = usePlaylist()
</script>

<template>
  <div class="grid gap-6">
    <div>
      <h2 class="font-serif text-2xl">Playlists</h2>
      <PlaylistList current-tab="music" />
    </div>

    <div>
      <h2 class="font-serif text-2xl">All Music</h2>
      <div v-for="song in musics" :key="song.id" class="mb-4">
        <p>{{ song.file }}</p>
        <audio
          :src="`/uploads/${song.file}`"
          controls
          preload="none"
          class="w-full"
        ></audio>
      </div>
    </div>
  </div>
</template>
