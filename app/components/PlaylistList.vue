<script setup lang="ts">
  const {
    playlists,
    musics,
    selectedMusicIds,
    deletePlaylist,
    addItemsToPlaylist,
  } = usePlaylist()
  const { queue, playAt } = useQueue()

  const normalizedPlaylists = computed(() =>
    playlists.value.map((pl) => ({
      ...pl,
      items: pl.playlist_items,
    })),
  )

  const buildQueueFromPlaylist = (pl: any) => {
    const items =
      pl.items && Array.isArray(pl.items) ? pl.items : pl.playlist_items || []
    return items
      .map((item: any) => {
        const file = item.file || item.music
        if (!file) return null
        return {
          id: file.id,
          src: `/uploads/music/${file.title}`,
          title: file.title || file.title || 'Unknown',
        }
      })
      .filter(Boolean)
  }

  const playPlaylist = (pl: any) => {
    const list = buildQueueFromPlaylist(pl)
    if (!list.length) return
    queue.value = list
    playAt(0)
  }
</script>

<template>
  <div v-if="playlists.length" class="mt-4 flex w-full flex-col gap-2 lg:grid">
    <div
      v-for="pl in normalizedPlaylists"
      :key="pl.id"
      class="col border-default flex flex-col border p-2 lg:flex-row"
    >
      <div class="flex items-center justify-between">
        <NuxtLink :to="`/playlists/${pl.id}`">
          <h3 class="font-serif text-xl">
            {{ pl.title }}
          </h3>
        </NuxtLink>
        <div class="flex items-center gap-2 text-xs">
          <button
            class="border-default border px-2 py-1"
            @click="playPlaylist(pl)"
          >
            <UIcon name="i-lucide-play" class="size-5" />
          </button>
          <button @click="deletePlaylist(pl.id)">
            <UIcon name="i-lucide-circle-x" class="size-5" />
          </button>
        </div>
      </div>

      <ul v-if="pl.items?.length">
        <PlaylistItem v-for="item in pl.items" :key="item.id" :item="item" />
      </ul>
      <p v-else class="text-sm text-gray-500">No items in this playlist.</p>

      <!-- Add items -->
      <div class="mt-2 grid gap-2">
        <select
          v-model="selectedMusicIds"
          multiple
          class="border-default border p-2 uppercase"
        >
          <option
            v-for="file in musics"
            :key="file.id"
            :value="file.id"
            class="text-sm"
          >
            {{ file.title }}
          </option>
        </select>
        <button
          class="border-default border p-2 text-sm"
          @click.prevent="addItemsToPlaylist(pl.id, selectedMusicIds)"
        >
          Add Selected Items
        </button>
      </div>
    </div>
  </div>
  <p v-else class="text-sm text-gray-500">No playlists yet.</p>
</template>
