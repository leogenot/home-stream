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
    playlists,
    musics,
    movies,
    selectedMusicIds,
    selectedMoviesIds,
    deletePlaylist,
    addItemsToPlaylist,
  } = usePlaylist()

  const normalizedPlaylists = computed(() =>
    playlists.value.map((pl) => ({
      ...pl,
      items:
        props.currentTab === 'music'
          ? pl.music_playlist_items
          : pl.movies_playlist_items,
    })),
  )

  watch(
    () => props.currentTab,
    () => {
      console.log('props.currentTab', props.currentTab, playlists.value)
    },
  )
</script>

<template>
  <div v-if="playlists.length" class="mt-4 grid gap-2">
    <div v-for="pl in normalizedPlaylists" :key="pl.id" class="border p-2">
      <div class="flex items-center justify-between">
        <h3 class="font-serif text-lg">
          <NuxtLink
            :to="`/playlists/${currentTab}/${pl.id}`"
            class="underline decoration-dotted hover:decoration-solid"
          >
            {{ pl.title }}
          </NuxtLink>
        </h3>
        <button
          class="text-sm text-red-600"
          @click="deletePlaylist(currentTab, pl.id)"
        >
          Delete Playlist
        </button>
      </div>

      <ul v-if="pl.items?.length">
        <PlaylistItem
          v-for="item in pl.items"
          :key="item.id"
          :item="item"
          :current-tab="currentTab"
        />
      </ul>
      <p v-else class="text-gray-500">No items in this playlist.</p>

      <!-- Add items -->
      <div v-if="currentTab === 'music'" class="mt-2">
        <select
          v-model="selectedMusicIds"
          multiple
          class="border p-2 uppercase"
        >
          <option v-for="file in musics" :key="file.id" :value="file.id">
            {{ file.file }}
          </option>
        </select>
        <button
          class="mt-1 border p-2 text-sm"
          @click.prevent="addItemsToPlaylist('music', pl.id, selectedMusicIds)"
        >
          Add Selected Items
        </button>
      </div>
      <div v-if="currentTab === 'movies'" class="mt-2">
        <select
          v-model="selectedMoviesIds"
          multiple
          class="border p-2 uppercase"
        >
          <option v-for="file in movies" :key="file.id" :value="file.id">
            {{ file.file }}
          </option>
        </select>
        <button
          class="mt-1 border p-2 text-sm"
          @click.prevent="
            addItemsToPlaylist('movies', pl.id, selectedMoviesIds)
          "
        >
          Add Selected Items
        </button>
      </div>
    </div>
  </div>
  <p v-else class="text-gray-500">No playlists yet.</p>
</template>
