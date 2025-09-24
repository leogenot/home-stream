<script setup lang="ts">
  const route = useRoute()
  const isActive = (path: string) =>
    route.path === path || (path !== '/' && route.path.startsWith(path))
</script>
<template>
  <nav class="fixed bottom-0 left-0 h-fit w-full bg-white p-4">
    <div class="inline-flex w-full items-center justify-between">
      <nuxt-link
        to="/"
        class="menu-entry text-xxs flex flex-col items-center justify-center gap-1"
        :class="{ 'text-black': isActive('/'), 'text-gray-500': !isActive('/') }"
      >
        <span
          class="material-symbols-outlined text-[24px] leading-none"
          :class="{ 'font-bold': isActive('/'), 'opacity-60': !isActive('/') }"
        >
          music_note
        </span>
        <span :class="{ 'font-medium': isActive('/') }">Music</span>
      </nuxt-link>
      <nuxt-link
        to="/playlists"
        class="menu-entry text-xxs flex flex-col items-center justify-center gap-1"
        :class="{ 'text-black': isActive('/playlists'), 'text-gray-500': !isActive('/playlists') }"
      >
        <span
          class="material-symbols-outlined text-[24px] leading-none"
          :class="{ 'font-bold': isActive('/playlists'), 'opacity-60': !isActive('/playlists') }"
        >
          queue_music
        </span>
        <span :class="{ 'font-medium': isActive('/playlists') }">Playlists</span>
      </nuxt-link>
      <nuxt-link
        to="/upload"
        class="menu-entry text-xxs flex flex-col items-center justify-center gap-1"
        :class="{ 'text-black': isActive('/upload'), 'text-gray-500': !isActive('/upload') }"
      >
        <span
          class="material-symbols-outlined text-[24px] leading-none"
          :class="{ 'font-bold': isActive('/upload'), 'opacity-60': !isActive('/upload') }"
        >
          upload
        </span>
        <span :class="{ 'font-medium': isActive('/upload') }">Upload</span>
      </nuxt-link>
      <nuxt-link
        to="/profile"
        class="menu-entry text-xxs flex flex-col items-center justify-center gap-1"
        :class="{ 'text-black': isActive('/profile'), 'text-gray-500': !isActive('/profile') }"
      >
        <span
          class="material-symbols-outlined text-[24px] leading-none"
          :class="{ 'font-bold': isActive('/profile'), 'opacity-60': !isActive('/profile') }"
        >
          account_circle
        </span>
        <span :class="{ 'font-medium': isActive('/profile') }">Profile</span>
      </nuxt-link>
    </div>
  </nav>

</template>
