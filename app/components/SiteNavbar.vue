<template>
  <nav class="fixed bottom-0 left-0 h-fit w-full bg-red-300 p-4">
    <div class="inline-flex w-full items-center justify-between">
      <nuxt-link
        to="/"
        class="menu-entry text-xxs flex flex-col items-center justify-center gap-1"
      >
        <div class="icon size-4 bg-blue-200"></div>
        <span>Music</span>
      </nuxt-link>
      <nuxt-link
        to="/playlists"
        class="menu-entry text-xxs flex flex-col items-center justify-center gap-1"
      >
        <div class="icon size-4 bg-blue-200"></div>
        <span>Playlists</span>
      </nuxt-link>
      <nuxt-link
        to="/upload"
        class="menu-entry text-xxs flex flex-col items-center justify-center gap-1"
      >
        <div class="icon size-4 bg-blue-200"></div>
        <span>Upload</span>
      </nuxt-link>
      <nuxt-link
        to="/profile"
        class="menu-entry text-xxs flex flex-col items-center justify-center gap-1"
      >
        <div class="icon size-4 bg-blue-200"></div>
        <span>Profile</span>
      </nuxt-link>
    </div>
  </nav>
</template>
