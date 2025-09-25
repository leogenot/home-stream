<script setup lang="ts">
  const route = useRoute()
  const { fetchPlaylistById, parsePlaylistIdFromSlug, removeItemFromPlaylist } =
    usePlaylist()

  const { playAllNow, playAllRandomNow, playSong } = useQueue()

  const playlist = ref<Awaited<ReturnType<typeof fetchPlaylistById>> | null>(
    null,
  )
  const isLoading = ref(true)

  const load = async () => {
    const id = parsePlaylistIdFromSlug(route.params.slug)
    if (!id) {
      isLoading.value = false
      return
    }
    playlist.value = await fetchPlaylistById(id)
    isLoading.value = false
  }

  onMounted(load)
  watch(() => route.params.slug, load)

  const pageTitle = computed(() =>
    playlist.value ? playlist.value.title : 'Playlist',
  )
  useHead({ title: pageTitle })

  const songsFromPlaylist = computed(() =>
    playlist.value ? playlist.value.playlist_items.map((it) => it.file) : [],
  )

  const onPlayItem = (index: number) => {
    playSong(index, songsFromPlaylist.value)
  }

  const onRemoveItem = async (itemId: number) => {
    await removeItemFromPlaylist(itemId)
    await load()
  }
</script>

<template>
  <div class="grid gap-4 py-4">
    <div>
      <h1 class="font-serif text-2xl">{{ playlist?.title || 'Playlist' }}</h1>
      <p class="text-sm text-gray-600">
        Share this URL to share your playlist.
      </p>
    </div>

    <div v-if="isLoading" class="text-sm text-gray-600">Loading...</div>
    <div v-else-if="!playlist" class="text-sm text-red-600">
      Playlist not found.
    </div>
    <div v-else class="grid gap-2">
      <div class="flex items-center justify-between">
        <h2 class="font-serif text-xl">Tracks</h2>
        <div class="flex items-center gap-2">
          <button
            class="border border-black/40 px-2 py-1 text-xs uppercase"
            @click="playAllNow(playlist.playlist_items.map((it) => it.file))"
          >
            Play All
          </button>
          <button
            class="border border-black/40 px-2 py-1 text-xs uppercase"
            @click="
              playAllRandomNow(playlist.playlist_items.map((it) => it.file))
            "
          >
            Random
          </button>
        </div>
      </div>
      <ul class="grid gap-2">
        <li
          v-for="(it, idx) in playlist.playlist_items"
          :key="it.id"
          class="flex items-center justify-between border border-black/40 p-2"
        >
          <span class="text-sm">{{ it.file.file }}</span>
          <div class="flex items-center gap-2">
            <button
              class="border border-black/40 px-2 py-1 text-xs uppercase"
              @click="onPlayItem(idx)"
            >
              Play
            </button>
            <button
              class="border border-black/40 px-2 py-1 text-xs uppercase"
              @click="onRemoveItem(it.id)"
            >
              Remove
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
