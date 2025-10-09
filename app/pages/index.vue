<script setup lang="ts">
  definePageMeta({
    title: 'Home Stream',
    middleware: 'auth',
  })

  const { refreshUserData } = useUser()
  const { songs, hasMore, isLoading, loadMore } = useMusic()
  const { playAllNow, playAllRandomNow, playSong, addToQueue } = useQueue()

  // Setup infinite scroll
  useInfiniteScroll(loadMore, {
    enabled: computed(() => hasMore.value && !isLoading.value),
  })

  // Setup scroll animation
  const songsContainer = ref<HTMLElement | null>(null)
  const { setupObserver } = useScrollAnimation(songsContainer)

  // Re-setup observer when songs change
  watch(songs, () => {
    nextTick(() => {
      setupObserver()
    })
  })

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })

  useSeoMeta({
    title: 'Your Music Library',
    description:
      'Browse and play your personal music collection. Stream all your favorite songs, create playlists, and enjoy your music anywhere.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    ogTitle: 'Your Music Library - Home Stream',
    ogDescription:
      'Browse and play your personal music collection with Home Stream.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Your Music Library - Home Stream',
    twitterDescription:
      'Browse and play your personal music collection with Home Stream.',
  })
</script>

<template>
  <UPage>
    <div class="flex justify-between pb-1">
      <h1 class="font-serif text-2xl">Music</h1>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 text-sm"
          aria-label="Play all songs"
          @click="playAllNow(songs)"
        >
          <UIcon name="i-lucide-play" class="size-5" aria-hidden="true" />
        </button>
        <button
          class="px-3 py-1 text-sm"
          aria-label="Shuffle all songs"
          @click="playAllRandomNow(songs)"
        >
          <UIcon name="i-lucide-shuffle" class="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
    <USeparator />
    <ul ref="songsContainer" class="songs-list">
      <li
        v-for="(song, i) in songs"
        :key="song.id"
        class="song-item my-6 flex w-full items-center justify-between gap-3"
      >
        <button
          class="truncate text-left font-serif text-sm text-wrap overflow-ellipsis"
          :aria-label="`Play ${song.title} by ${song.artist}`"
          @click="playSong(i, songs)"
        >
          {{ song.title }}
          <span class="text-xs opacity-80">- {{ song.artist }}</span>
        </button>
        <div class="flex shrink-0 items-center gap-2">
          <button
            class="px-2 py-1 text-xs"
            :aria-label="`Play ${song.title}`"
            @click="playSong(i, songs)"
          >
            <UIcon name="i-lucide-play" class="size-5" aria-hidden="true" />
          </button>
          <button
            class="px-2 py-1 text-xs"
            :aria-label="`Add ${song.title} to queue`"
            @click="addToQueue(song)"
          >
            <UIcon
              name="i-lucide-list-plus"
              class="size-5"
              aria-hidden="true"
            />
          </button>
        </div>
      </li>
    </ul>

    <!-- Loading indicator -->
    <div
      v-if="isLoading"
      class="py-4 text-center text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      Loading more songs...
    </div>

    <!-- End of list indicator -->
    <div
      v-else-if="!hasMore && songs.length > 0"
      class="py-4 text-center text-sm text-gray-400"
      role="status"
    >
      No more songs to load
    </div>
  </UPage>
</template>

<style scoped>
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
