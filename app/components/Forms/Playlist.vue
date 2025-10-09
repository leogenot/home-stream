<script setup lang="ts">
  const {
    newPlaylistTitle,
    selectedMusicIds,
    musics,
    playlistError,
    playlistSuccess,
    createPlaylist,
  } = usePlaylist()
</script>

<template>
  <div class="w-full">
    <h2 class="font-serif text-xl">Create Playlist</h2>
    <form class="grid gap-2" @submit.prevent="createPlaylist()">
      <label for="playlist-title-input" class="sr-only">Playlist title</label>
      <input
        id="playlist-title-input"
        v-model="newPlaylistTitle"
        class="border-default border p-2 text-sm uppercase"
        placeholder="Title"
        aria-label="Playlist title"
        required
      />
      <label for="playlist-songs-select" class="sr-only">
        Select songs for playlist
      </label>
      <select
        id="playlist-songs-select"
        v-model="selectedMusicIds"
        multiple
        class="border-default border p-2 uppercase"
        aria-label="Select songs for playlist"
      >
        <option
          v-for="file in musics"
          :key="file.id"
          :value="file.id"
          class="text-sm"
        >
          {{ file.title }}
        </option>
      </select>
      <UButton
        aria-label="Create playlist"
        type="submit"
        color="neutral"
        variant="subtle"
        size="sm"
        class="w-full justify-center p-2 text-center uppercase"
      >
        Create
      </UButton>
    </form>

    <p v-if="playlistError" class="text-sm text-red-600" role="alert">
      {{ playlistError }}
    </p>
    <p v-if="playlistSuccess" class="text-sm text-green-600" role="status">
      {{ playlistSuccess }}
    </p>
  </div>
</template>
