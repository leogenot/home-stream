<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core'
  const audioRef = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const progress = ref(0) // percent (0-100)
  const duration = ref(0) // seconds
  const currentTime = ref(0) // seconds

  const {
    queue,
    currentIndex,
    currentItem,
    playAt,
    playFrom,
    isManagerOpen,
    removeAt,
    moveItem,
    clearQueue,
    toggleManager,
  } = useQueue()

  // Track if the user has interacted with the page yet (required for autoplay policies)
  const hasUserGesture = ref(false)

  const play = () => {
    if (!audioRef.value) return
    const playPromise = audioRef.value.play()
    if (
      playPromise &&
      typeof (playPromise as Promise<void>).then === 'function'
    ) {
      ;(playPromise as Promise<void>)
        .then(() => {
          isPlaying.value = true
        })
        .catch(() => {
          // Likely NotAllowedError due to missing user gesture. Keep paused state.
          isPlaying.value = false
        })
    } else {
      isPlaying.value = true
    }
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

  // New: Set duration as soon as possible
  const onLoadedMetadata = () => {
    if (!audioRef.value) return
    duration.value = audioRef.value.duration || 0
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
        // Always set volume to 1
        audioRef.value.volume = 1
        // Only attempt autoplay if the user has interacted with the page
        if (hasUserGesture.value) play()
      }
    })
  })

  // Always set volume to 1 when audioRef is available
  watch(
    audioRef,
    (a) => {
      if (a && a instanceof HTMLAudioElement) a.volume = 1
    },
    { immediate: true },
  )

  // --- Swipe gesture handling for mobile ---
  const { isMobileOrTablet } = useDevice()
  const { width: innerWidth } = useWindowSize()

  const isMobile = computed(() => {
    if (import.meta.server) return isMobileOrTablet
    return innerWidth.value < 900
  })

  // Touch event state
  const touchStartX = ref<number | null>(null)
  const touchEndX = ref<number | null>(null)
  const swipeThreshold = 50 // px

  function onTouchStart(e: TouchEvent) {
    if (!isMobile.value) return
    if (!e.touches || e.touches.length === 0) return
    const firstTouch = e.touches.item(0)
    if (!firstTouch) return
    touchStartX.value = firstTouch.clientX
    touchEndX.value = null
  }

  function onTouchMove(e: TouchEvent) {
    if (!isMobile.value) return
    if (!e.touches || e.touches.length === 0) return
    const firstTouch = e.touches.item(0)
    if (!firstTouch) return
    touchEndX.value = firstTouch.clientX
  }

  function onTouchEnd() {
    if (
      !isMobile.value ||
      touchStartX.value === null ||
      touchEndX.value === null
    )
      return
    const deltaX = touchEndX.value - touchStartX.value
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        prev()
      } else {
        next()
      }
    }
    touchStartX.value = null
    touchEndX.value = null
  }

  // Helper to format seconds as mm:ss
  function formatTime(secs: number): string {
    if (!secs || isNaN(secs) || !isFinite(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Mark user gesture on first interaction to allow future autoplay attempts
  onMounted(() => {
    const markGesture = () => {
      hasUserGesture.value = true
      document.removeEventListener('pointerdown', markGesture)
      document.removeEventListener('touchstart', markGesture)
      document.removeEventListener('keydown', markGesture)
      document.removeEventListener('click', markGesture, true)
    }
    document.addEventListener('pointerdown', markGesture)
    document.addEventListener('touchstart', markGesture)
    document.addEventListener('keydown', markGesture)
    // capture click as a fallback
    document.addEventListener('click', markGesture, true)
  })

  const artist = ref<string | null>(null)
  const pictureUrl = ref<string | null>(null)
  const album = ref<string | null>(null)
  const showCover = useState('showCover', () => true)

  function updateMediaSessionMetadata() {
    if (import.meta.server) return
    if (!('mediaSession' in navigator)) return
    const title = currentItem.value?.title || ''
    const artistName = artist.value || ''
    const albumName = album.value || ''
    const cover = pictureUrl.value || ''
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: artistName,
        album: albumName,
        artwork: cover
          ? [
              { src: cover, sizes: '96x96', type: 'image/jpeg' },
              { src: cover, sizes: '192x192', type: 'image/jpeg' },
              { src: cover, sizes: '256x256', type: 'image/jpeg' },
              { src: cover, sizes: '384x384', type: 'image/jpeg' },
              { src: cover, sizes: '512x512', type: 'image/jpeg' },
            ]
          : [],
      })
    } catch (e) {
      // ignore
    }
  }

  function updateMediaSessionPlaybackState() {
    if (import.meta.server) return
    if (!('mediaSession' in navigator)) return
    try {
      navigator.mediaSession.playbackState = isPlaying.value
        ? 'playing'
        : 'paused'
    } catch (e) {
      // ignore
    }
  }

  function updateMediaSessionPositionState() {
    if (import.meta.server) return
    if (!('mediaSession' in navigator)) return
    if (!('setPositionState' in navigator.mediaSession)) return
    try {
      navigator.mediaSession.setPositionState({
        duration: duration.value || 0,
        position: currentTime.value || 0,
      })
    } catch (e) {
      // ignore
    }
  }

  watch(currentItem, async () => {
    if (!currentItem.value?.src) return
    pictureUrl.value = null
    showCover.value = false

    try {
      const filename = currentItem.value.src.split('/').pop()
      pictureUrl.value = `/api/cover/${encodeURIComponent(filename!)}`
      // Update media session metadata when we have track info
      updateMediaSessionMetadata()
    } catch (err) {
      console.warn('Failed to fetch metadata:', err)
    }
  })

  // Keep Media Session state in sync
  watch(isPlaying, () => {
    updateMediaSessionPlaybackState()
  })

  watch([duration, currentTime], () => {
    updateMediaSessionPositionState()
  })

  onMounted(() => {
    if (import.meta.server) return
    if (!('mediaSession' in navigator)) return
    // Action handlers for lockscreen / OS controls
    try {
      navigator.mediaSession.setActionHandler?.('play', () => {
        play()
      })
      navigator.mediaSession.setActionHandler?.('pause', () => {
        pause()
      })
      navigator.mediaSession.setActionHandler?.('previoustrack', () => {
        prev()
      })
      navigator.mediaSession.setActionHandler?.('nexttrack', () => {
        next()
      })
      navigator.mediaSession.setActionHandler?.('seekto', (details: any) => {
        if (!audioRef.value) return
        if (typeof details?.seekTime === 'number') {
          audioRef.value.currentTime = details.seekTime
        }
      })
    } catch (e) {
      // ignore
    }
  })

  const isSeeking = ref(false)

  const onProgressInput = (percent: number) => {
    if (!audioRef.value || !duration.value) return
    isSeeking.value = true
    const newTime = (percent / 100) * duration.value
    audioRef.value.currentTime = newTime
    currentTime.value = newTime
    progress.value = percent
    // release after a short delay so audio updates can take over again
    setTimeout(() => {
      isSeeking.value = false
    }, 200)
  }

  const onTimeUpdate = () => {
    if (!audioRef.value || isSeeking.value) return
    const a = audioRef.value
    duration.value = a.duration || 0
    currentTime.value = a.currentTime || 0
    progress.value = a.duration ? (a.currentTime / a.duration) * 100 : 0
  }
</script>

<template>
  <div
    v-if="currentItem"
    class="bg-muted/80 border-muted/50 fixed right-2 bottom-14 left-2 z-10 mx-auto rounded-xl border p-2 shadow-lg shadow-neutral-950/5 backdrop-blur-sm sm:p-4 lg:bottom-16"
  >
    <div
      class="wrapper grid w-full"
      :class="{ 'select-none': isMobile }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        class="mb-4 flex w-full items-center justify-between overflow-x-clip"
      >
        <div
          class="grid w-full items-center justify-center gap-3 overflow-x-clip"
        >
          <transition mode="out-in" name="reveal">
            <img
              v-if="pictureUrl"
              v-show="showCover"
              :src="pictureUrl"
              alt="cover"
              class="object-fit aspect-square h-auto w-full max-w-96 overflow-clip rounded-lg bg-transparent"
            />
          </transition>

          <div class="grid w-full items-center justify-center gap-1">
            <div
              class="w-full cursor-pointer text-center font-serif text-sm"
              @click="showCover = !showCover"
            >
              {{ currentItem.title }}
            </div>
            <div v-if="currentItem.artist" class="truncate text-center text-xs">
              {{ currentItem.artist }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full items-center justify-center gap-2">
        <button class="px-2 py-1 text-xs" @click="prev">
          <UIcon name="i-lucide-chevron-first" class="size-5" />
        </button>
        <button class="px-2 py-1 text-xs" @click="toggle">
          <transition mode="out-in">
            <UIcon v-if="isPlaying" name="i-lucide-pause" class="size-5" />
            <UIcon v-else name="i-lucide-play" class="size-5" />
          </transition>
        </button>
        <button class="px-2 py-1 text-xs" @click="next">
          <UIcon name="i-lucide-chevron-last" class="size-5" />
        </button>
      </div>
      <div class="mt-2 flex w-full items-center gap-2">
        <span class="text-xs tabular-nums">
          {{ formatTime(currentTime) }}
        </span>
        <USlider
          v-model="progress"
          :min="0"
          :max="100"
          :step="0.1"
          class="w-full"
          color="neutral"
          @update:model-value="onProgressInput"
        />

        <span class="text-xs tabular-nums">
          {{ formatTime(duration) }}
        </span>
        <button class="px-2 py-1 text-xs" @click="toggleManager">
          <UIcon name="i-lucide-list-music" class="size-5" />
        </button>
      </div>
      <audio
        ref="audioRef"
        class="w-full"
        :src="currentItem?.src"
        preload="none"
        @ended="onEnded"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
      />
      <!-- Queue Manager -->
      <div v-if="isManagerOpen" class="mt-3 w-full border-t pt-3">
        <div class="mb-2 flex w-full items-center justify-between">
          <div class="text-xs">Queue ({{ queue.length }})</div>
          <div class="flex items-center gap-2">
            <button
              class="border-default border px-2 py-1 text-xs"
              @click="clearQueue"
            >
              Clear
            </button>
            <button
              class="border-default border px-2 py-1 text-xs"
              @click="toggleManager"
            >
              Close
            </button>
          </div>
        </div>
        <ul class="max-h-60 w-full overflow-y-auto text-sm">
          <li
            v-for="(item, i) in queue"
            :key="item.id + '-' + i"
            class="border-default/80 mb-1 flex w-full items-center justify-between gap-2 rounded border p-2"
            :class="{ 'border-default': i === currentIndex }"
          >
            <div
              class="w-full font-serif text-sm text-wrap overflow-ellipsis"
              @click="playFrom(i)"
            >
              {{ item.title }}
            </div>
            <div class="flex shrink-0 items-center gap-1">
              <button
                class="border-default border px-1 py-0.5 text-sm"
                :disabled="i === 0"
                @click="moveItem(i, i - 1)"
              >
                ↑
              </button>
              <button
                class="border-default border px-1 py-0.5 text-sm"
                :disabled="i === queue.length - 1"
                @click="moveItem(i, i + 1)"
              >
                ↓
              </button>
              <button
                class="border-default border px-1 py-0.5 text-sm"
                @click="removeAt(i)"
              >
                ✕
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
  .reveal-enter-active,
  .reveal-leave-active {
    transition:
      max-height 0.25s ease-in-out,
      opacity 0.25s ease-in-out;
    overflow: hidden;
  }
  .reveal-enter-from,
  .reveal-leave-to {
    max-height: 0;
    opacity: 0;
  }
  .reveal-enter-to,
  .reveal-leave-from {
    max-height: 392px;
    opacity: 1;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
