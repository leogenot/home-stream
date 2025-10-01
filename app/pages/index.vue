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
  <div class="grid w-full gap-6">
    <div>
      <h2 class="font-serif text-2xl">Music</h2>
    </div>

    <div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            class="border border-black/40 px-3 py-1 text-sm"
            @click="playAllNow(songs)"
          >
            <span class="material-symbols-outlined leading-none">
              play_arrow
            </span>
          </button>
          <button
            class="border border-black/40 px-3 py-1 text-sm"
            @click="playAllRandomNow(songs)"
          >
            <span class="material-symbols-outlined leading-none">shuffle</span>
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
          <button
            class="border border-black/40 px-2 py-1 text-xs"
            @click="playSong(i, songs)"
          >
            <span class="material-symbols-outlined leading-none">
              play_arrow
            </span>
          </button>
          <button
            class="border border-black/40 px-2 py-1 text-xs"
            @click="addToQueue(song)"
          >
            <span class="material-symbols-outlined leading-none">
              playlist_add
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
