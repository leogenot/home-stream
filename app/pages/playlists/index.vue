<script setup lang="ts">
  useHead({ title: 'Playlists' })

  const currentTab = ref<'music' | 'movies'>('music')
  const changeTab = (tab: 'music' | 'movies') => {
    currentTab.value = tab
  }
</script>

<template>
  <div class="px-bleed mx-auto grid w-full gap-8">
    <div class="flex w-full justify-around gap-4 pb-2">
      <button
        class="px-4 py-2 font-serif uppercase"
        :class="currentTab === 'music' ? 'border-b' : 'text-gray-500'"
        @click="changeTab('music')"
      >
        Music
      </button>
      <button
        class="px-4 py-2 font-serif uppercase"
        :class="currentTab === 'movies' ? 'border-b' : 'text-gray-500'"
        @click="changeTab('movies')"
      >
        Movies
      </button>
    </div>
    <FormsPlaylist :current-tab="currentTab" />
    <PlaylistList :current-tab="currentTab" />
    <upload :current-tab="currentTab" />
  </div>
</template>
