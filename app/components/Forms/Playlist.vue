<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      currentTab?: 'music' | 'movies'
    }>(),
    {
      currentTab: 'music',
    },
  )

  const {
    newPlaylistTitle,
    selectedMusicIds,
    selectedMoviesIds,
    musics,
    movies,
    playlistError,
    playlistSuccess,
    createPlaylist,
  } = usePlaylist()
</script>

<template>
  <div class="w-full">
    <h2 class="font-serif text-xl">Create Playlist</h2>
    <form class="grid gap-2" @submit.prevent="createPlaylist(currentTab)">
      <input
        v-model="newPlaylistTitle"
        class="border p-2 text-sm uppercase"
        placeholder="Title"
        required
      />
      <select
        v-if="currentTab === 'music'"
        v-model="selectedMusicIds"
        multiple
        class="border p-2 uppercase"
      >
        <option
          v-for="file in musics"
          :key="file.id"
          :value="file.id"
          class="text-sm"
        >
          {{ file.file }}
        </option>
      </select>
      <select
        v-if="currentTab === 'movies'"
        v-model="selectedMoviesIds"
        multiple
        class="border p-2 uppercase"
      >
        <option
          v-for="file in movies"
          :key="file.id"
          :value="file.id"
          class="text-sm"
        >
          {{ file.file }}
        </option>
      </select>

      <button type="submit" class="cursor-pointer border p-2 text-sm uppercase">
        Create
      </button>
    </form>

    <p v-if="playlistError" class="text-sm text-red-600">{{ playlistError }}</p>
    <p v-if="playlistSuccess" class="text-sm text-green-600">
      {{ playlistSuccess }}
    </p>
  </div>
</template>
