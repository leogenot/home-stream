<script setup lang="ts">
  import useAlbums from '~/composables/useAlbums'

  definePageMeta({
    middleware: 'auth',
  })

  const { refreshUserData } = useUser()
  const { albums, hasMore, isLoading, loadMore, getAlbumSlug } = useAlbums()

  // Setup infinite scroll
  useInfiniteScroll(loadMore, {
    enabled: computed(() => hasMore.value && !isLoading.value),
  })

  // Setup scroll animation
  const albumsContainer = ref<HTMLElement | null>(null)
  const { setupObserver } = useScrollAnimation(albumsContainer)

  // Re-setup observer when albums change
  watch(albums, () => {
    nextTick(() => {
      setupObserver()
    })
  })

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })

  useSeoMeta({
    title: 'Albums',
    description:
      'Browse your music collection by albums. Discover and play your favorite albums organized by artist.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    ogTitle: 'Albums - Home Stream',
    ogDescription: 'Browse your music collection by albums on Home Stream.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Albums - Home Stream',
    twitterDescription:
      'Browse your music collection by albums on Home Stream.',
  })
</script>

<template>
  <UPage>
    <div class="flex justify-between pb-1">
      <h1 class="font-serif text-2xl">Albums</h1>
    </div>
    <USeparator />

    <div
      v-if="albums.length === 0"
      class="text-muted-foreground py-8 text-center"
      role="status"
    >
      <p>No albums found</p>
    </div>

    <ul
      v-else
      ref="albumsContainer"
      class="albums-list grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <li
        v-for="album in albums"
        :key="`${album.name}-${album.artist}`"
        class="album-item group bg-card hover:bg-accent block rounded-lg transition-colors"
      >
        <NuxtLink
          :to="`/albums/${getAlbumSlug(album)}`"
          :aria-label="`View album ${album.name} by ${album.artist}, ${album.songs.length} song${album.songs.length !== 1 ? 's' : ''}`"
        >
          <div class="bg-muted aspect-square overflow-hidden rounded-md">
            <img
              v-if="album.coverUrl"
              :src="album.coverUrl"
              :alt="`Album cover for ${album.name} by ${album.artist}`"
              class="h-full w-full object-cover transition-transform group-hover:scale-105"
              @error="
                (e: Event) => {
                  const target = e.target as HTMLImageElement
                  if (target) target.style.display = 'none'
                }
              "
            />
            <div
              v-else
              class="text-muted-foreground flex h-full w-full items-center justify-center text-4xl"
              aria-label="No album cover available"
            >
              <UIcon name="i-lucide-music" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-2 space-y-1">
            <h2 class="truncate text-sm leading-none font-medium">
              {{ album.name }}
            </h2>
            <p class="text-muted-foreground truncate text-xs">
              {{ album.artist }}
            </p>
            <p class="text-muted-foreground text-xs">
              {{ album.songs.length }} song{{
                album.songs.length !== 1 ? 's' : ''
              }}
            </p>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <!-- Loading indicator -->
    <div
      v-if="isLoading"
      class="py-8 text-center text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      Loading more albums...
    </div>

    <!-- End of list indicator -->
    <div
      v-else-if="!hasMore && albums.length > 0"
      class="py-8 text-center text-sm text-gray-400"
      role="status"
    >
      All albums loaded
    </div>
  </UPage>
</template>

<style scoped>
  .albums-list .album-item {
    transform: scale(0.985);
    opacity: 0;
    transition:
      transform 400ms ease,
      opacity 400ms ease;
    will-change: transform, opacity;
  }

  .albums-list .album-item.in-view {
    transform: scale(1);
    opacity: 1;
  }
</style>
