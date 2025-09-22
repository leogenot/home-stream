<script setup lang="ts">
  import type { Playlist } from '@/composables/usePlaylist'
  const {
    queue,
    currentIndex: queueIndex,
    addToQueue,
    removeFromQueue,
    clearQueue,
    moveItem,
    playAt,
  } = useQueue()

  const route = useRoute()
  const router = useRouter()
  const typeParam = computed(() =>
    (route.params.type as string) === 'movies' ? 'movies' : 'music',
  )
  const playlistId = computed(() => Number(route.params.id))

  const { fetchPlaylistById } = usePlaylist()

  const {
    data: playlist,
    pending,
    error,
  } = await useAsyncData<Playlist | null>(
    () => `playlist-${typeParam.value}-${playlistId.value}`,
    async () => {
      if (!playlistId.value || Number.isNaN(playlistId.value)) return null
      return await fetchPlaylistById(
        typeParam.value as 'music' | 'movies',
        playlistId.value,
      )
    },
  )

  // Player state (driven by queue)
  const isPlayingAll = ref(false)
  const mediaPlaying = ref(false)
  const mediaEl = ref<HTMLAudioElement | HTMLVideoElement | null>(null)
  const items = computed(() => playlist.value?.playlist_items || [])
  const currentQueueItem = computed(() => queue.value[queueIndex.value])
  const currentSrc = computed(() => currentQueueItem.value?.src || '')

  // Queue helpers (map playlist items to queue items)
  const mapToQueueItem = (it: { file?: { id: number; file: string } }) => ({
    id: it.file?.id || 0,
    src: it.file?.file ? `/uploads/${it.file.file}` : '',
    title: it.file?.file || 'Unknown',
  })

  const addAllToQueue = () => {
    if (!items.value.length) return
    addToQueue(items.value.map(mapToQueueItem))
  }

  const addSingleToQueue = (idx: number) => {
    const it = items.value[idx]
    if (!it) return
    addToQueue(mapToQueueItem(it))
  }

  // No local index; queue drives playback

  const playQueueAt = (idx: number) => {
    if (!queue.value.length) return
    if (idx < 0 || idx >= queue.value.length) return
    playAt(idx)
    nextTick(() => {
      if (mediaEl.value) {
        ;(mediaEl.value as HTMLMediaElement).load()
        ;(mediaEl.value as HTMLMediaElement).play().catch(() => {})
      }
    })
  }

  // Legacy helpers kept for reference, no longer used
  // const playAll = () => {}
  // const pauseAll = () => {}

  const nextItem = () => {
    if (!queue.value.length) return
    const next = queueIndex.value + 1
    if (next < queue.value.length) {
      playQueueAt(next)
    } else {
      isPlayingAll.value = false
    }
  }

  const prevItem = () => {
    if (!queue.value.length) return
    const prev = queueIndex.value - 1
    if (prev >= 0) playQueueAt(prev)
  }

  const handleEnded = () => {
    if (isPlayingAll.value) nextItem()
    else mediaPlaying.value = false
  }

  const handlePlay = () => {
    mediaPlaying.value = true
  }

  const handlePause = () => {
    mediaPlaying.value = false
  }

  const togglePlayPause = () => {
    if (!queue.value.length) return
    if (!mediaEl.value) return
    const el = mediaEl.value as HTMLMediaElement
    if (mediaPlaying.value) {
      isPlayingAll.value = false
      el.pause()
    } else {
      isPlayingAll.value = true
      // ensure correct src is loaded
      el.load()
      el.play().catch(() => {})
    }
  }

  watchEffect(() => {
    if (playlist.value) {
      useHead({
        title: `${playlist.value.title} · ${typeParam.value === 'music' ? 'Music' : 'Movies'} Playlist`,
        meta: [
          {
            name: 'description',
            content: `Listen to ${playlist.value.title} ${typeParam.value} playlist.`,
          },
          { property: 'og:title', content: `${playlist.value.title}` },
          {
            property: 'og:description',
            content: `Listen to this ${typeParam.value} playlist on Curin.`,
          },
          { property: 'og:type', content: 'website' },
          {
            property: 'og:url',
            content: `${useRuntimeConfig().public.BASE_URL}/playlists/${typeParam.value}/${playlistId.value}`,
          },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: `${playlist.value.title}` },
          {
            name: 'twitter:description',
            content: `Listen to this ${typeParam.value} playlist on Curin.`,
          },
        ],
      })
    }
  })

  if (!['music', 'movies'].includes(typeParam.value)) {
    router.replace('/playlists')
  }
</script>

<template>
  <div class="px-bleed mx-auto w-full py-4">
    <NuxtLink to="/playlists" class="text-sm text-gray-500">
      ← Back to Playlists
    </NuxtLink>

    <div v-if="pending" class="mt-6">Loading…</div>
    <div v-else-if="error || !playlist" class="mt-6 text-red-600">
      Playlist not found.
    </div>

    <div v-else class="mt-4">
      <h1 class="font-serif text-2xl">{{ playlist.title }}</h1>
      <p class="text-xs text-gray-500 uppercase">
        {{ typeParam === 'music' ? 'Music' : 'Movies' }} playlist
      </p>

      <div v-if="items.length" class="mt-4 grid gap-2">
        <!-- Player Controls -->
        <div class="flex items-center gap-2">
          <button
            class="border px-2 py-1 text-sm"
            :disabled="!queue.length || queueIndex === 0"
            @click="prevItem"
          >
            Prev
          </button>
          <button class="border px-2 py-1 text-sm" @click="togglePlayPause">
            {{ mediaPlaying ? 'Pause' : 'Play' }}
          </button>
          <button
            class="border px-2 py-1 text-sm"
            :disabled="!queue.length || queueIndex >= queue.length - 1"
            @click="nextItem"
          >
            Next
          </button>
          <span class="ml-2 text-xs text-gray-600">
            {{ currentQueueItem?.title || 'No selection' }}
            <template v-if="queue.length">
              ({{ queueIndex + 1 }}/{{ queue.length }})
            </template>
          </span>
          <button
            class="ml-auto border px-2 py-1 text-sm"
            @click="addAllToQueue"
          >
            Add All to Queue
          </button>
        </div>

        <!-- Media Element -->
        <div>
          <audio
            v-if="typeParam === 'music'"
            ref="mediaEl"
            :src="currentSrc"
            controls
            @ended="handleEnded"
            @play="handlePlay"
            @pause="handlePause"
          />
          <video
            v-else
            ref="mediaEl"
            :src="currentSrc"
            class="max-h-[60vh] w-full bg-black"
            controls
            @ended="handleEnded"
            @play="handlePlay"
            @pause="handlePause"
          />
        </div>
      </div>

      <ul v-if="playlist.playlist_items?.length" class="mt-4 grid gap-2">
        <li
          v-for="item in playlist.playlist_items"
          :key="item.id"
          class="flex items-center justify-between border p-2 hover:bg-gray-50"
        >
          <span
            class="cursor-pointer font-serif text-lg"
            @click="addSingleToQueue(playlist.playlist_items.indexOf(item))"
          >
            {{ item.file?.file || 'Unknown' }}
          </span>
          <button
            class="border px-2 py-1 text-xs"
            @click.stop="
              addSingleToQueue(playlist.playlist_items.indexOf(item))
            "
          >
            + Queue
          </button>
        </li>
      </ul>
      <p v-else class="mt-4 text-gray-500">No items in this playlist.</p>

      <!-- Queue Panel -->
      <div class="mt-6 rounded border">
        <div class="flex items-center justify-between border-b p-2">
          <h2 class="font-serif">Queue</h2>
          <div class="flex items-center gap-2">
            <button
              class="border px-2 py-1 text-xs"
              :disabled="!queue.length"
              @click="clearQueue"
            >
              Clear
            </button>
          </div>
        </div>
        <ul v-if="queue.length" class="divide-y">
          <li
            v-for="(q, idx) in queue"
            :key="q.id + '-' + idx"
            :class="[
              'flex items-center gap-2 p-2 text-sm',
              idx === queueIndex ? 'bg-blue-50' : '',
            ]"
          >
            <button
              class="border px-2 py-0.5"
              :disabled="idx === 0"
              @click="moveItem(idx, Math.max(0, idx - 1))"
            >
              ↑
            </button>
            <button
              class="border px-2 py-0.5"
              :disabled="idx === queue.length - 1"
              @click="moveItem(idx, Math.min(queue.length - 1, idx + 1))"
            >
              ↓
            </button>
            <span class="flex-1 truncate">{{ q.title }}</span>
            <button class="border px-2 py-0.5" @click="playQueueAt(idx)">
              Play
            </button>
            <button
              class="border px-2 py-0.5 text-red-600"
              @click="removeFromQueue(idx)"
            >
              Remove
            </button>
          </li>
        </ul>
        <p v-else class="p-2 text-sm text-gray-500">Queue is empty.</p>
      </div>
    </div>
  </div>
</template>
