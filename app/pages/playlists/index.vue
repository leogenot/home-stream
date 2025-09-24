<script setup lang="ts">
const {
    playlists,
    musics,
    selectedMusicIds,
    newPlaylistTitle,
    playlistError,
    playlistSuccess,
    fetchPlaylists,
    fetchMusics,
    createPlaylist,
    addItemsToPlaylist,
    deletePlaylist,
    makePlaylistSlug,
} = usePlaylist()

const { playAllNow, playAllRandomNow } = useQueue()

onMounted(() => {
    fetchPlaylists()
    fetchMusics()
})

const addToExisting = async (playlistId: number, musicId: number) => {
    await addItemsToPlaylist(playlistId, [musicId])
}

// Track which playlist is selected for each song row
const selectedPlaylistBySong = reactive<Record<number, number | null>>({})
const addSongToSelected = async (songId: number) => {
  const pid = selectedPlaylistBySong[songId]
  if (!pid) return
  await addItemsToPlaylist(pid, [songId])
}

const songsFromPlaylist = (p: { playlist_items: { file: { id: number; file: string } }[] }) =>
  p.playlist_items.map((it) => it.file)
</script>

<template>
  <div class="p-4 grid gap-6">
    <div>
      <h1 class="font-serif text-2xl">Playlists</h1>
      <p class="text-sm text-gray-600">Create and manage your playlists. Share links are public.</p>
    </div>

    <div class="grid gap-2">
      <h2 class="font-serif text-xl">Create Playlist</h2>
      <form class="grid gap-2" @submit.prevent="createPlaylist()">
        <input
          v-model="newPlaylistTitle"
          class="border p-2 text-sm uppercase"
          placeholder="Title"
          required
        />
        <select v-model="selectedMusicIds" multiple class="border p-2 uppercase">
          <option v-for="file in musics" :key="file.id" :value="file.id" class="text-sm">
            {{ file.file }}
          </option>
        </select>
        <button type="submit" class="cursor-pointer border p-2 text-sm uppercase">Create</button>
      </form>

      <p v-if="playlistError" class="text-sm text-red-600">{{ playlistError }}</p>
      <p v-if="playlistSuccess" class="text-sm text-green-600">{{ playlistSuccess }}</p>
    </div>

    <div class="grid gap-3">
      <h2 class="font-serif text-xl">Your Playlists</h2>
      <div v-if="!playlists.length" class="text-sm text-gray-500">No playlists yet.</div>
      <ul class="grid gap-3">
        <li v-for="p in playlists" :key="p.id" class="border p-3">
          <div class="flex items-center justify-between gap-2">
            <NuxtLink class="underline" :to="`/playlists/${makePlaylistSlug(p.title, p.id)}`">
              {{ p.title }}
            </NuxtLink>
            <div class="flex items-center gap-2">
              <button class="text-xs uppercase border px-2 py-1" @click="playAllNow(songsFromPlaylist(p))">Play All</button>
              <button class="text-xs uppercase border px-2 py-1" @click="playAllRandomNow(songsFromPlaylist(p))">Random</button>
              <button class="text-xs uppercase border px-2 py-1" @click="deletePlaylist(p.id)">Delete</button>
            </div>
          </div>
          <div class="mt-2">
            <h3 class="text-sm font-semibold">Items ({{ p.playlist_items.length }})</h3>
            <ul class="text-sm list-disc ml-4">
              <li v-for="it in p.playlist_items" :key="it.id">{{ it.file.file }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div class="grid gap-2">
      <h2 class="font-serif text-xl">All Songs</h2>
      <ul class="grid gap-2">
        <li v-for="m in musics" :key="m.id" class="flex items-center justify-between border p-2">
          <span class="text-sm">{{ m.file }}</span>
          <div class="flex items-center gap-2">
            <select
              v-model="selectedPlaylistBySong[m.id]"
              class="border p-1 text-xs uppercase"
            >
              <option :value="null" disabled>Select playlist</option>
              <option v-for="p in playlists" :key="p.id" :value="p.id">{{ p.title }}</option>
            </select>
            <button class="text-xs uppercase border px-2 py-1" @click="addSongToSelected(m.id)">Add</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


