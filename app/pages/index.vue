<script setup lang="ts">
  definePageMeta({
    title: 'Home Stream',
    middleware: 'auth',
  })
  useHead({
    title: 'Music',
  })
  const { refreshUserData } = useUser()

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })
  const { songs } = useMusic()
  const { playAllNow, playAllRandomNow, playSong, addToQueue } = useQueue()
</script>

<template>
  <UPage>
    <div>
      <h2 class="font-serif text-2xl">Music</h2>
    </div>

    <div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 text-sm" @click="playAllNow(songs)">
            <UIcon name="i-lucide-play" class="size-5" />
          </button>
          <button class="px-3 py-1 text-sm" @click="playAllRandomNow(songs)">
            <UIcon name="i-lucide-shuffle" class="size-5" />
          </button>
        </div>
      </div>
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
