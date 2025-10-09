<script setup lang="ts">
  import useAlbums from '~/composables/useAlbums'

  definePageMeta({
    middleware: 'auth',
  })

  const route = useRoute()
  const { refreshUserData } = useUser()
  const { albums, getAlbumBySlug } = useAlbums()
  const { playAllNow, playAllRandomNow, playSong, addToQueue } = useQueue()

  const albumSlug = route.params.album as string
  const album = computed(() => getAlbumBySlug(albumSlug))

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })

  // Dynamic SEO based on album data
  watchEffect(() => {
    if (album.value) {
      useSeoMeta({
        title: `${album.value.name} by ${album.value.artist}`,
        description: `Listen to ${album.value.name} by ${album.value.artist}. Album contains ${album.value.songs.length} song${album.value.songs.length !== 1 ? 's' : ''}. Stream now on Home Stream.`,
        robots:
          'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
        ogTitle: `${album.value.name} by ${album.value.artist} - Home Stream`,
        ogDescription: `Listen to ${album.value.name} by ${album.value.artist} on Home Stream. ${album.value.songs.length} tracks available.`,
        ogType: 'music.album',
        ogImage: album.value.coverUrl || '/android-chrome-512x512.png',
        twitterCard: 'summary_large_image',
        twitterTitle: `${album.value.name} by ${album.value.artist}`,
        twitterDescription: `Listen to ${album.value.name} by ${album.value.artist} on Home Stream.`,
        twitterImage: album.value.coverUrl || '/android-chrome-512x512.png',
      })
    } else {
      useSeoMeta({
        title: 'Album Not Found',
        description:
          'The album you are looking for could not be found. Browse our music library to discover more albums.',
        robots:
          'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
        ogTitle: 'Album Not Found - Home Stream',
        ogDescription:
          'The album you are looking for could not be found on Home Stream.',
      })
    }
  })

  const playAlbum = () => {
    if (album.value) {
      playAllNow(album.value.songs)
    }
  }

  const shuffleAlbum = () => {
    if (album.value) {
      playAllRandomNow(album.value.songs)
    }
  }

  // Setup scroll animation
  const songsContainer = ref<HTMLElement | null>(null)
  const { setupObserver } = useScrollAnimation(songsContainer)

  // Re-setup observer when album songs change
  watch(
    () => album.value?.songs,
    () => {
      nextTick(() => {
        setupObserver()
      })
    },
  )
</script>

<template>
  <UPage>
    <div v-if="!album" class="py-8 text-center">
      <h1 class="mb-4 font-serif text-2xl">Album not found</h1>
      <p class="text-muted-foreground mb-4">
        The album you're looking for doesn't exist.
      </p>
      <NuxtLink
        to="/albums"
        class="text-primary hover:underline"
        aria-label="Return to albums page"
      >
        ← Back to Albums
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Album Header -->
      <div class="mb-6 flex gap-4">
        <div
          class="bg-muted h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40"
        >
          <img
            v-if="album.coverUrl"
            :src="album.coverUrl"
            :alt="`Album cover for ${album.name} by ${album.artist}`"
            class="h-full w-full object-cover"
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
        <div class="min-w-0 flex-1">
          <h1 class="mb-2 font-serif text-2xl font-bold sm:text-3xl">
            {{ album.name }}
          </h1>
          <p class="text-muted-foreground mb-4 text-lg">{{ album.artist }}</p>
          <p class="text-muted-foreground mb-4 text-sm">
            {{ album.songs.length }} song{{
              album.songs.length !== 1 ? 's' : ''
            }}
          </p>
          <div class="flex items-center gap-2">
            <button
              class="hover:bg-accent px-3 py-1 text-sm"
              :aria-label="`Play all songs from ${album.name}`"
              @click="playAlbum"
            >
              <UIcon name="i-lucide-play" class="size-5" aria-hidden="true" />
            </button>
            <button
              class="hover:bg-accent px-3 py-1 text-sm"
              :aria-label="`Shuffle all songs from ${album.name}`"
              @click="shuffleAlbum"
            >
              <UIcon
                name="i-lucide-shuffle"
                class="size-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      <USeparator class="mb-4" />

      <!-- Songs List -->
      <div
        v-if="album.songs.length === 0"
        class="text-muted-foreground py-8 text-center"
        role="status"
      >
        <p>No songs found in this album</p>
      </div>

      <ul v-else ref="songsContainer" class="songs-list">
        <li
          v-for="(song, i) in album.songs"
          :key="song.id"
          class="song-item my-6 flex w-full items-center justify-between gap-3"
        >
          <button
            class="hover:text-primary cursor-pointer truncate text-left font-serif text-sm text-wrap overflow-ellipsis"
            :aria-label="`Play ${song.title}`"
            @click="playSong(i, album.songs)"
          >
            {{ song.title }}
          </button>
          <div class="flex shrink-0 items-center gap-2">
            <button
              class="hover:bg-accent px-2 py-1 text-xs"
              :aria-label="`Play ${song.title}`"
              @click="playSong(i, album.songs)"
            >
              <UIcon name="i-lucide-play" class="size-5" aria-hidden="true" />
            </button>
            <button
              class="hover:bg-accent px-2 py-1 text-xs"
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
