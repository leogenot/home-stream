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

  useHead({
    title: album.value ? `${album.value.name} - ${album.value.artist}` : 'Album'
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
</script>

<template>
  <UPage>
    <div v-if="!album" class="py-8 text-center">
      <h2 class="font-serif text-2xl mb-4">Album not found</h2>
      <p class="text-muted-foreground mb-4">The album you're looking for doesn't exist.</p>
      <NuxtLink to="/albums" class="text-primary hover:underline">
        ← Back to Albums
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Album Header -->
      <div class="flex gap-4 mb-6">
        <div class="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          <img
            v-if="album.coverUrl"
            :src="album.coverUrl"
            :alt="`${album.name} by ${album.artist}`"
            class="w-full h-full object-cover"
            @error="(e: Event) => { const target = e.target as HTMLImageElement; if (target) target.style.display = 'none' }"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center text-4xl text-muted-foreground"
          >
            <UIcon name="i-lucide-music" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="font-serif text-2xl sm:text-3xl font-bold mb-2">{{ album.name }}</h1>
          <p class="text-lg text-muted-foreground mb-4">{{ album.artist }}</p>
          <p class="text-sm text-muted-foreground mb-4">
            {{ album.songs.length }} song{{ album.songs.length !== 1 ? 's' : '' }}
          </p>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 text-sm hover:bg-accent"
              @click="playAlbum"
            >
              <UIcon name="i-lucide-play" class="size-5" />
            </button>
            <button
              class="px-3 py-1 text-sm hover:bg-accent"
              @click="shuffleAlbum"
            >
              <UIcon name="i-lucide-shuffle" class="size-5" />
            </button>
          </div>
        </div>
      </div>

      <USeparator class="mb-4" />

      <!-- Songs List -->
      <div v-if="album.songs.length === 0" class="py-8 text-center text-muted-foreground">
        <p>No songs found in this album</p>
      </div>

      <div v-else>
        <div
          v-for="(song, i) in album.songs"
          :key="song.id"
          class="my-6 flex w-full items-center justify-between gap-3"
        >
          <div
            class="truncate font-serif text-sm text-wrap overflow-ellipsis cursor-pointer hover:text-primary"
            @click="playSong(i, album.songs)"
          >
            {{ song.title }}
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button
              class=" px-2 py-1 text-xs hover:bg-accent"
              @click="playSong(i, album.songs)"
            >
              <UIcon name="i-lucide-play" class="size-5" />
            </button>
            <button
              class=" px-2 py-1 text-xs hover:bg-accent"
              @click="addToQueue(song)"
            >
              <UIcon name="i-lucide-list-plus" class="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </UPage>
</template>
