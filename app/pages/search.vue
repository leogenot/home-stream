<script setup lang="ts">
  definePageMeta({
    title: 'Search Music',
    middleware: 'auth',
  })
  useSeoMeta({
    title: 'Search Music',
    description:
      'Search through your music library. Find songs by title, artist, or album name quickly and easily.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    ogTitle: 'Search Music - Home Stream',
    ogDescription: 'Search through your music library on Home Stream.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Search Music - Home Stream',
    twitterDescription: 'Search through your music library on Home Stream.',
  })

  const { songs, hasMore, isLoading, loadMore } = useMusic()
  const { playAllNow, playAllRandomNow, playSong, addToQueue } = useQueue()

  const searchQuery = ref('')
  const searchResults = computed(() => {
    if (!searchQuery.value.trim()) {
      return songs.value
    }

    const query = searchQuery.value.toLowerCase().trim()
    return songs.value.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query),
    )
  })

  // Setup infinite scroll - only load more when not searching or when showing all results
  useInfiniteScroll(loadMore, {
    enabled: computed(() => hasMore.value && !isLoading.value),
  })

  const clearSearch = () => {
    searchQuery.value = ''
  }

  // Setup scroll animation
  const songsContainer = ref<HTMLElement | null>(null)
  const { setupObserver } = useScrollAnimation(songsContainer)

  // Re-setup observer when search results change
  watch(searchResults, () => {
    nextTick(() => {
      setupObserver()
    })
  })
</script>

<template>
  <UPage>
    <div class="flex justify-between pb-1">
      <h1 class="font-serif text-2xl">Search songs</h1>
    </div>
    <USeparator />
    <!-- Search Input -->
    <div class="my-6">
      <div class="relative">
        <label for="search-input" class="sr-only">
          Search for songs by title, artist, or album
        </label>
        <UInput
          id="search-input"
          v-model="searchQuery"
          icon="i-lucide-search"
          size="md"
          variant="outline"
          placeholder="Search..."
          class="w-full"
          aria-label="Search for songs"
        />
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0">
      <div
        class="mb-4 text-sm text-gray-600 dark:text-gray-400"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ searchResults.length }} song{{
          searchResults.length !== 1 ? 's' : ''
        }}
        found
        <span v-if="searchQuery.trim()">for "{{ searchQuery }}"</span>
      </div>

      <ul ref="songsContainer" class="songs-list">
        <li
          v-for="(song, i) in searchResults"
          :key="song.id"
          class="song-item my-6 flex w-full items-center justify-between gap-3"
        >
          <button
            class="cursor-pointer truncate text-left font-serif text-sm text-wrap overflow-ellipsis hover:opacity-80"
            :aria-label="`Play ${song.title} by ${song.artist}${song.album ? ' from ' + song.album : ''}`"
            @click="playSong(i, searchResults)"
          >
            {{ song.title }}
            <span class="text-xs opacity-80">- {{ song.artist }}</span>
            <span v-if="song.album" class="block text-xs opacity-60">
              {{ song.album }}
            </span>
          </button>
          <div class="flex shrink-0 items-center gap-2">
            <button
              class="rounded px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
              :aria-label="`Play ${song.title}`"
              @click="playSong(i, searchResults)"
            >
              <UIcon name="i-lucide-play" class="size-5" aria-hidden="true" />
            </button>
            <button
              class="rounded px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
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

      <!-- Loading indicator (only show when not filtering with search) -->
      <div
        v-if="isLoading && !searchQuery.trim()"
        class="py-4 text-center text-sm text-gray-500"
        role="status"
        aria-live="polite"
      >
        Loading more songs...
      </div>

      <!-- End of list indicator -->
      <div
        v-else-if="!hasMore && !searchQuery.trim() && songs.length > 0"
        class="py-4 text-center text-sm text-gray-400"
        role="status"
      >
        All songs loaded
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="searchQuery.trim()" class="py-12 text-center" role="status">
      <UIcon
        name="i-lucide-search-x"
        class="mx-auto mb-4 size-12 text-gray-400"
        aria-hidden="true"
      />
      <h2 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
        No songs found
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Try searching with different keywords or check your spelling.
      </p>
    </div>

    <!-- Empty State -->
    <div v-else-if="songs.length === 0" class="py-12 text-center">
      <UIcon
        name="i-lucide-music"
        class="mx-auto mb-4 size-12 text-gray-400"
        aria-hidden="true"
      />
      <h2 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
        No music uploaded yet
      </h2>
      <p class="mb-4 text-gray-600 dark:text-gray-400">
        Upload some music to start searching through your collection.
      </p>
      <NuxtLink
        to="/upload"
        class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        aria-label="Go to upload page"
      >
        <UIcon name="i-lucide-upload" class="mr-2 size-4" aria-hidden="true" />
        Upload Music
      </NuxtLink>
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
