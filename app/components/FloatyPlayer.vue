<script setup lang="ts">
  const audioRef = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const progress = ref(0)
  const volume = useState<number>('player-volume', () => 1)

  const { queue, currentIndex, currentItem, playAt } = useQueue()

  const play = () => {
    if (!audioRef.value) return
    audioRef.value.play()
    isPlaying.value = true
  }
  const pause = () => {
    if (!audioRef.value) return
    audioRef.value.pause()
    isPlaying.value = false
  }
  const toggle = () => (isPlaying.value ? pause() : play())
  const next = () => {
    if (currentIndex.value < queue.value.length - 1)
      playAt(currentIndex.value + 1)
  }
  const prev = () => {
    if (currentIndex.value > 0) playAt(currentIndex.value - 1)
  }

  const onTimeUpdate = () => {
    if (!audioRef.value) return
    const a = audioRef.value
    progress.value = a.duration ? (a.currentTime / a.duration) * 100 : 0
  }

  const onEnded = () => {
    if (currentIndex.value < queue.value.length - 1) next()
    else isPlaying.value = false
  }

  watch(currentItem, () => {
    // Autoplay when track changes
    nextTick(() => {
      if (audioRef.value) {
        audioRef.value.currentTime = 0
        audioRef.value.load()
        play()
      }
    })
  })

  watch(
    volume,
    (v) => {
      if (audioRef.value) audioRef.value.volume = Math.min(1, Math.max(0, v))
    },
    { immediate: true },
  )
</script>

<template>
  <div
    v-if="currentItem"
    class="fixed right-4 bottom-4 z-50 w-[320px] rounded-md border bg-white p-3 shadow-xl"
  >
    <div class="mb-2 truncate font-serif text-sm">{{ currentItem.title }}</div>
    <div class="flex items-center gap-2">
      <button class="border px-2 py-1 text-xs" @click="prev">Prev</button>
      <button class="border px-2 py-1 text-xs" @click="toggle">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <button class="border px-2 py-1 text-xs" @click="next">Next</button>
    </div>
    <div class="mt-2">
      <div class="h-1 w-full bg-gray-200">
        <div class="h-1 bg-gray-800" :style="{ width: progress + '%' }" />
      </div>
    </div>
    <div class="mt-2 flex items-center gap-2">
      <span class="text-xs">Vol</span>
      <input type="range" min="0" max="1" step="0.01" v-model.number="volume" />
    </div>
    <audio
      ref="audioRef"
      :src="currentItem?.src"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      preload="none"
    />
  </div>
</template>

<style scoped>
  /* minimal, rely on tailwind utility classes */
</style>
