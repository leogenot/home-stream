<script setup lang="ts">
  definePageMeta({
    // middleware: 'auth',
  })

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

  // Dynamic SEO based on playlist data
  watchEffect(() => {
    if (playlist.value) {
      const trackCount = playlist.value.playlist_items.length
      useSeoMeta({
        title: playlist.value.title,
        description: `Listen to ${playlist.value.title} playlist. Contains ${trackCount} track${trackCount !== 1 ? 's' : ''}. Stream now on Home Stream.`,
        robots:
          'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
        ogTitle: `${playlist.value.title} - Playlist on Home Stream`,
        ogDescription: `Listen to ${playlist.value.title} playlist with ${trackCount} tracks on Home Stream.`,
        ogType: 'music.playlist',
        twitterCard: 'summary',
        twitterTitle: `${playlist.value.title} - Playlist`,
        twitterDescription: `Listen to ${playlist.value.title} playlist with ${trackCount} tracks on Home Stream.`,
      })
    } else if (!isLoading.value) {
      useSeoMeta({
        title: 'Playlist Not Found',
        description:
          'The playlist you are looking for could not be found. Browse our playlists to discover more music.',
        robots:
          'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
        ogTitle: 'Playlist Not Found - Home Stream',
        ogDescription:
          'The playlist you are looking for could not be found on Home Stream.',
      })
    }
  })

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
      <p class="text-sm opacity-60">Share this URL to share your playlist.</p>
    </div>
    <USeparator />

    <div v-if="isLoading" class="text-sm opacity-60">Loading...</div>
    <div v-else-if="!playlist" class="text-sm">Playlist not found.</div>
    <div v-else class="grid gap-2">
      <div class="flex items-center justify-between">
        <h2 class="font-serif text-xl">Tracks</h2>
        <div class="flex items-center gap-2">
          <button
            class="px-2 py-1 text-xs uppercase"
            @click="playAllNow(playlist.playlist_items.map((it) => it.file))"
          >
            <UIcon name="i-lucide-play" class="size-5" />
          </button>
          <button
            class="px-2 py-1 text-xs uppercase"
            @click="
              playAllRandomNow(playlist.playlist_items.map((it) => it.file))
            "
          >
            <UIcon name="i-lucide-shuffle" class="size-5" />
          </button>
        </div>
      </div>
      <ul class="grid gap-2">
        <li
          v-for="(it, idx) in playlist.playlist_items"
          :key="it.id"
          class="border-default flex items-center justify-between rounded-sm border p-2"
        >
          <span class="text-sm">{{ it.file.title }}</span>
          <div class="flex items-center gap-2">
            <button
              class="px-2 py-1 text-xs uppercase"
              @click="onPlayItem(idx)"
            >
              <UIcon name="i-lucide-play" class="size-5" />
            </button>
            <button
              class="px-2 py-1 text-xs uppercase"
              @click="onRemoveItem(it.id)"
            >
              <UIcon name="i-lucide-circle-x" class="size-5" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
