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

  // Player state
  const currentIndex = ref(0)
  const isPlayingAll = ref(false)
  const mediaEl = ref<HTMLAudioElement | HTMLVideoElement | null>(null)
  const items = computed(() => playlist.value?.playlist_items || [])
  const currentItem = computed(() => items.value[currentIndex.value])
  const currentSrc = computed(() =>
    currentItem.value?.file?.file
      ? `/uploads/${currentItem.value.file.file}`
      : '',
  )

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

  watchEffect(() => {
    // Reset to first item when playlist changes
    if (items.value.length) {
      currentIndex.value = 0
    }
  })

  const playIndex = (idx: number) => {
    if (idx < 0 || idx >= items.value.length) return
    currentIndex.value = idx
    // allow media element to update src before playing
    nextTick(() => {
      if (mediaEl.value) {
        // Some browsers require load before play when src changes
        ;(mediaEl.value as HTMLMediaElement).load()
        ;(mediaEl.value as HTMLMediaElement).play().catch(() => {})
      }
    })
  }

  const playAll = () => {
    if (!items.value.length) return
    isPlayingAll.value = true
    playIndex(currentIndex.value || 0)
  }

  const pauseAll = () => {
    isPlayingAll.value = false
    if (mediaEl.value) (mediaEl.value as HTMLMediaElement).pause()
  }

  const nextItem = () => {
    if (!items.value.length) return
    const next = currentIndex.value + 1
    if (next < items.value.length) {
      playIndex(next)
    } else {
      // reached end
      isPlayingAll.value = false
    }
  }

  const prevItem = () => {
    if (!items.value.length) return
    const prev = currentIndex.value - 1
    if (prev >= 0) playIndex(prev)
  }

  const handleEnded = () => {
    if (isPlayingAll.value) nextItem()
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
  <div class="mx-auto w-full max-w-2xl p-4">
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
            @click="prevItem"
            :disabled="currentIndex === 0"
          >
            Prev
          </button>
          <button
            v-if="!isPlayingAll"
            class="border px-2 py-1 text-sm"
            @click="playAll"
          >
            Play All
          </button>
          <button v-else class="border px-2 py-1 text-sm" @click="pauseAll">
            Pause
          </button>
          <button
            class="border px-2 py-1 text-sm"
            @click="nextItem"
            :disabled="currentIndex >= items.length - 1"
          >
            Next
          </button>
          <span class="ml-2 text-xs text-gray-600">
            {{ currentItem?.file?.file || 'Unknown' }}
            ({{ currentIndex + 1 }}/{{ items.length }})
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
          />
          <video
            v-else
            ref="mediaEl"
            :src="currentSrc"
            class="max-h-[60vh] w-full bg-black"
            controls
            @ended="handleEnded"
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
            class="cursor-pointer"
            @click="playIndex(playlist.playlist_items.indexOf(item))"
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
              @click="clearQueue"
              :disabled="!queue.length"
            >
              Clear
            </button>
          </div>
        </div>
        <ul v-if="queue.length" class="divide-y">
          <li
            v-for="(q, idx) in queue"
            :key="q.id + '-' + idx"
            class="flex items-center gap-2 p-2 text-sm"
          >
            <button
              class="border px-2 py-0.5"
              @click="moveItem(idx, Math.max(0, idx - 1))"
              :disabled="idx === 0"
            >
              ↑
            </button>
            <button
              class="border px-2 py-0.5"
              @click="moveItem(idx, Math.min(queue.length - 1, idx + 1))"
              :disabled="idx === queue.length - 1"
            >
              ↓
            </button>
            <span class="flex-1 truncate">{{ q.title }}</span>
            <button class="border px-2 py-0.5" @click="playAt(idx)">
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
