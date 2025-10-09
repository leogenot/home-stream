<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })

  useSeoMeta({
    title: 'Playlists',
    description:
      'Create and manage your music playlists. Organize your favorite songs into custom playlists and share them with others.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    ogTitle: 'Playlists - Home Stream',
    ogDescription: 'Create and manage your music playlists on Home Stream.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Playlists - Home Stream',
    twitterDescription:
      'Create and manage your music playlists on Home Stream.',
  })

  const {
    playlists,
    musics,
    musicsHasMore,
    musicsIsLoading,
    loadMoreMusics,
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

  // Setup infinite scroll for musics section
  useInfiniteScroll(loadMoreMusics, {
    enabled: computed(() => musicsHasMore.value && !musicsIsLoading.value),
  })

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

  const mappedMusics = computed(() => {
    return musics.value?.map((music) => ({
      label: music.title,
      artist: music.artist,
      value: String(music.id),
    }))
  })

  const mappedPlaylists = computed(() => {
    return playlists.value?.map((playlist) => ({
      label: playlist.title,
      value: String(playlist.id),
    }))
  })

  // Setup scroll animations
  const playlistsContainer = ref<HTMLElement | null>(null)
  const songsContainer = ref<HTMLElement | null>(null)
  const { setupObserver: setupPlaylistsObserver } =
    useScrollAnimation(playlistsContainer)
  const { setupObserver: setupSongsObserver } =
    useScrollAnimation(songsContainer)

  // Re-setup observers when data changes
  watch(playlists, () => {
    nextTick(() => {
      setupPlaylistsObserver()
    })
  })

  watch(musics, () => {
    nextTick(() => {
      setupSongsObserver()
    })
  })
</script>

<template>
  <div class="grid w-full gap-6">
    <div>
      <h2 class="font-serif text-2xl">Playlists</h2>
      <p class="text-sm text-gray-600">
        Create and manage your playlists. Share links are public.
      </p>
    </div>
    <USeparator />

    <div class="grid gap-2">
      <h2 class="font-serif text-xl">Create Playlist</h2>
      <form class="grid gap-2" @submit.prevent="createPlaylist">
        <UInput
          v-model="newPlaylistTitle"
          class="text-sm uppercase"
          placeholder="Title"
          required
        />

        <USelectMenu
          v-model="selectedMusicIds"
          :items="mappedMusics"
          multiple
          selected-icon="i-lucide-check"
          placeholder="Select songs"
        >
          <template #item-label="{ item }">
            <div class="flex items-center justify-between gap-2 p-1 text-sm">
              <div class="flex flex-col gap-1">
                <span class="font-medium">{{ item.label }}</span>
                <span class="text-xs text-gray-500">{{ item.artist }}</span>
              </div>
            </div>
          </template>
        </USelectMenu>

        <UButton
          type="submit"
          color="neutral"
          variant="subtle"
          size="sm"
          class="justify-center p-2 text-center uppercase"
        >
          Create
        </UButton>
      </form>

      <p v-if="playlistError" class="text-sm text-red-600">
        {{ playlistError }}
      </p>
      <p v-if="playlistSuccess" class="text-sm text-green-600">
        {{ playlistSuccess }}
      </p>
    </div>
    <USeparator />

    <div class="grid gap-3">
      <h2 class="font-serif text-xl">Your Playlists</h2>
      <div v-if="!playlists.length" class="text-sm text-gray-500">
        No playlists yet.
      </div>
      <ul ref="playlistsContainer" class="playlists-list grid gap-3">
        <li
          v-for="p in playlists"
          :key="p.id"
          class="playlist-item border-default rounded-sm border p-3"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="title-wrapper inline-flex w-full justify-between">
              <NuxtLink :to="`/playlists/${makePlaylistSlug(p.title, p.id)}`">
                <h3 class="font-serif underline">{{ p.title }}</h3>
              </NuxtLink>
              <button
                class="px-2 py-1 text-xs uppercase"
                @click="deletePlaylist(p.id)"
              >
                <UIcon name="i-lucide-circle-x" class="size-5" />
              </button>
            </div>
            <div class="flex w-full items-center gap-2">
              <button
                class="px-2 py-1 text-xs uppercase"
                @click="playAllNow(songsFromPlaylist(p))"
              >
                <UIcon name="i-lucide-play" class="size-5" />
              </button>
              <button
                class="px-2 py-1 text-xs uppercase"
                @click="playAllRandomNow(songsFromPlaylist(p))"
              >
                <UIcon name="i-lucide-shuffle" class="size-5" />
              </button>
            </div>
          </div>
          <div class="mt-2">
            <ul class="ml-4 grid list-disc gap-2 text-sm">
              <li v-for="it in p.playlist_items" :key="it.id">
                {{ it.file.title }}
                <span class="text-xs opacity-80">- {{ it.file.artist }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <USeparator />

    <div class="grid gap-2">
      <h2 class="font-serif text-xl">All Songs</h2>
      <ul ref="songsContainer" class="songs-list grid gap-2">
        <li
          v-for="m in musics"
          :key="m.id"
          class="song-item border-default grid items-center gap-2 rounded-sm border p-2"
        >
          <span class="truncate font-serif text-sm text-wrap overflow-ellipsis">
            {{ m.title }}
            <span class="text-xs opacity-80">- {{ m.artist }}</span>
          </span>
          <div class="flex items-center gap-2">
            <USelectMenu
              v-model="selectedPlaylistBySong[m.id]"
              :items="mappedPlaylists"
              selected-icon="i-lucide-check"
              class="w-full"
              placeholder="Select playlist"
            />
            <button
              class="shrink-0 px-2 py-1 text-xs uppercase"
              @click="addSongToSelected(m.id)"
            >
              <UIcon name="i-lucide-list-plus" class="size-5" />
            </button>
          </div>
        </li>
      </ul>

      <!-- Loading indicator -->
      <div
        v-if="musicsIsLoading"
        class="py-4 text-center text-sm text-gray-500"
      >
        Loading more songs...
      </div>

      <!-- End of list indicator -->
      <div
        v-else-if="!musicsHasMore && musics.length > 0"
        class="py-4 text-center text-sm text-gray-400"
      >
        All songs loaded
      </div>
    </div>
  </div>
</template>

<style scoped>
  .playlists-list .playlist-item {
    transform: scale(0.985);
    opacity: 0;
    transition:
      transform 400ms ease,
      opacity 400ms ease;
    will-change: transform, opacity;
  }

  .playlists-list .playlist-item.in-view {
    transform: scale(1);
    opacity: 1;
  }

  .songs-list .song-item {
    transform: scale(0.985);
    opacity: 0;
    transition:
      transform 400ms ease,
      opacity 400ms ease;
    will-change: transform, opacity;
  }

  .songs-list .song-item.in-view {
    transform: scale(1);
    opacity: 1;
  }
</style>
