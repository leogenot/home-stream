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
      <input
        v-model="newPlaylistTitle"
        class="border-default border p-2 text-sm uppercase"
        placeholder="Title"
        required
      />
      <select
        v-model="selectedMusicIds"
        multiple
        class="border-default border p-2 uppercase"
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

    <p v-if="playlistError" class="text-sm text-red-600">{{ playlistError }}</p>
    <p v-if="playlistSuccess" class="text-sm text-green-600">
      {{ playlistSuccess }}
    </p>
  </div>
</template>
