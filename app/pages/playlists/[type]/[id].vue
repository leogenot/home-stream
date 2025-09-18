<script setup lang="ts">
  import type { Playlist } from '@/composables/usePlaylist'

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

      <ul v-if="playlist.playlist_items?.length" class="mt-4 grid gap-2">
        <li
          v-for="item in playlist.playlist_items"
          :key="item.id"
          class="border p-2"
        >
          {{ item.file?.file || 'Unknown' }}
        </li>
      </ul>
      <p v-else class="mt-4 text-gray-500">No items in this playlist.</p>
    </div>
  </div>
</template>
