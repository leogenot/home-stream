<script setup lang="ts">
  definePageMeta({
    title: 'Home Stream',
    middleware: 'auth',
  })

  const { refreshUserData } = useUser()
  const { songs } = useMusic()
  const { playAllNow, playAllRandomNow, playSong, addToQueue } = useQueue()

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
      <h2 class="font-serif text-2xl">Music</h2>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1 text-sm" @click="playAllNow(songs)">
          <UIcon name="i-lucide-play" class="size-5" />
        </button>
        <button class="px-3 py-1 text-sm" @click="playAllRandomNow(songs)">
          <UIcon name="i-lucide-shuffle" class="size-5" />
        </button>
      </div>
    </div>
    <USeparator />
    <div>
      <div
        v-for="(song, i) in songs"
        :key="song.id"
        class="my-6 flex w-full items-center justify-between gap-3"
      >
        <div
          class="truncate font-serif text-sm text-wrap overflow-ellipsis"
          @click="playSong(i, songs)"
        >
          {{ song.title }}
          <span class="text-xs opacity-80">- {{ song.artist }}</span>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <button class="px-2 py-1 text-xs" @click="playSong(i, songs)">
            <UIcon name="i-lucide-play" class="size-5" />
          </button>
          <button class="px-2 py-1 text-xs" @click="addToQueue(song)">
            <UIcon name="i-lucide-list-plus" class="size-5" />
          </button>
        </div>
      </div>
    </div>
  </UPage>
</template>
