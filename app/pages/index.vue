<script setup lang="ts">
  definePageMeta({ title: 'Home Stream' })
  useHead({
    title: 'Music',
  })
  const { musics } = usePlaylist()
  const { addToQueue, playAt, queue } = useQueue()

  const playSong = (idx: number) => {
    playAt(idx)
  }
  const enqueueAllIfEmpty = () => {
    if (!queue.value.length && musics.value.length) {
      addToQueue(
        musics.value.map((m) => ({
          id: m.id,
          src: `/uploads/music/${m.file}`,
          title: m.file,
        })),
      )
    }
  }

  const playAllNow = () => {
    if (!musics.value.length) return
    queue.value = musics.value.map((m) => ({
      id: m.id,
      src: `/uploads/music/${m.file}`,
      title: m.file,
    }))
    playAt(0)
  }
</script>

<template>
  <div class="grid w-full gap-6">
    <div>
      <h2 class="font-serif text-2xl">Playlists</h2>
      <PlaylistList current-tab="music" />
    </div>

    <div>
      <div class="flex items-center justify-between">
        <h2 class="font-serif text-2xl">All Music</h2>
        <div class="flex items-center gap-2">
          <button class="border px-3 py-1 text-sm" @click="enqueueAllIfEmpty">
            Enqueue All
          </button>
          <button class="border px-3 py-1 text-sm" @click="playAllNow">
            Play All
          </button>
        </div>
      </div>
      <div
        v-for="(song, i) in musics"
        :key="song.id"
        class="mb-3 flex max-w-screen flex-wrap items-center justify-between gap-3"
      >
        <div class="truncate font-serif text-sm">{{ song.file }}</div>
        <div class="flex items-center gap-2">
          <button
            class="border px-2 py-1 text-xs"
            @click="
              addToQueue({
                id: song.id,
                src: `/uploads/music/${song.file}`,
                title: song.file,
              })
            "
          >
            Add
          </button>
          <button class="border px-2 py-1 text-xs" @click="playSong(i)">
            Play
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
