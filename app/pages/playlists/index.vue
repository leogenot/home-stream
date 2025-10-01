<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })

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

  // Track which playlist is selected for each song row
  const selectedPlaylistBySong = reactive<Record<number, number | null>>({})
  const addSongToSelected = async (songId: number) => {
    const pid = selectedPlaylistBySong[songId]
    if (!pid) return
    await addItemsToPlaylist(pid, [songId])
  }

  const songsFromPlaylist = (p: {
    playlist_items: {
      file: {
        id: number
        title: string
        artist: string
        album: string
        file: string
      }
    }[]
  }) => p.playlist_items.map((it) => it.file)
</script>

<template>
  <div class="grid w-full gap-6">
    <div>
      <h2 class="font-serif text-2xl">Playlists</h2>
      <p class="text-sm text-gray-600">
        Create and manage your playlists. Share links are public.
      </p>
    </div>

    <div class="grid gap-2">
      <h2 class="font-serif text-xl">Create Playlist</h2>
      <form class="grid gap-2" @submit.prevent="createPlaylist()">
        <input
          v-model="newPlaylistTitle"
          class="border border-black/40 p-2 text-sm uppercase"
          placeholder="Title"
          required
        />
        <select
          v-model="selectedMusicIds"
          multiple
          class="border border-black/40 p-2 uppercase"
        >
          <option
            v-for="file in musics"
            :key="file.id"
            :value="file.id"
            class="mb-2 text-sm"
          >
            {{ file.title }} - {{ file.artist }}
          </option>
        </select>
        <button
          type="submit"
          class="cursor-pointer border border-black/40 p-2 text-sm uppercase"
        >
          Create
        </button>
      </form>

      <p v-if="playlistError" class="text-sm text-red-600">
        {{ playlistError }}
      </p>
      <p v-if="playlistSuccess" class="text-sm text-green-600">
        {{ playlistSuccess }}
      </p>
    </div>

    <div class="grid gap-3">
      <h2 class="font-serif text-xl">Your Playlists</h2>
      <div v-if="!playlists.length" class="text-sm text-gray-500">
        No playlists yet.
      </div>
      <ul class="grid gap-3">
        <li
          v-for="p in playlists"
          :key="p.id"
          class="border border-black/40 p-3"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="title-wrapper inline-flex w-full justify-between">
              <NuxtLink :to="`/playlists/${makePlaylistSlug(p.title, p.id)}`">
                <h3 class="font-serif underline">{{ p.title }}</h3>
              </NuxtLink>
              <button
                class="border border-black/40 px-2 py-1 text-xs uppercase"
                @click="deletePlaylist(p.id)"
              >
                Delete
              </button>
            </div>
            <div class="flex w-full items-center gap-2">
              <button
                class="border border-black/40 px-2 py-1 text-xs uppercase"
                @click="playAllNow(songsFromPlaylist(p))"
              >
                Play All
              </button>
              <button
                class="border border-black/40 px-2 py-1 text-xs uppercase"
                @click="playAllRandomNow(songsFromPlaylist(p))"
              >
                Random
              </button>
            </div>
          </div>
          <div class="mt-2">
            <ul class="ml-4 list-disc text-sm">
              <li v-for="it in p.playlist_items" :key="it.id">
                {{ it.file.title }}
                <span class="text-xs opacity-80">- {{ it.file.artist }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div class="grid gap-2">
      <h2 class="font-serif text-xl">All Songs</h2>
      <ul class="grid gap-2">
        <li
          v-for="m in musics"
          :key="m.id"
          class="grid items-center gap-2 border border-black/40 p-2"
        >
          <span class="truncate font-serif text-sm text-wrap overflow-ellipsis">
            {{ m.title }}
            <span class="text-xs opacity-80">- {{ m.artist }}</span>
          </span>
          <div class="flex items-center gap-2">
            <select
              v-model="selectedPlaylistBySong[m.id]"
              class="border border-black/40 px-2 py-0.5 text-xs uppercase"
            >
              <option :value="null" disabled>Select playlist</option>
              <option v-for="p in playlists" :key="p.id" :value="p.id">
                {{ p.title }}
              </option>
            </select>
            <button
              class="border border-black/40 px-2 py-1 text-xs uppercase"
              @click="addSongToSelected(m.id)"
            >
              Add
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
