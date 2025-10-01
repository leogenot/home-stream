<script setup lang="ts">
  import useAlbums from '~/composables/useAlbums'
  
  definePageMeta({
    middleware: 'auth',
  })

  const { refreshUserData } = useUser()
  const { albums, getAlbumSlug } = useAlbums()

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })

  useHead({ title: 'Albums' })
</script>

<template>
  <UPage>
    <div class="flex justify-between pb-1">
      <h2 class="font-serif text-2xl">Albums</h2>
    </div>
    <USeparator />
    
    <div v-if="albums.length === 0" class="py-8 text-center text-muted-foreground">
      <p>No albums found</p>
    </div>
    
    <div v-else class="grid grid-cols-2 pt-4 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <NuxtLink
        v-for="album in albums"
        :key="`${album.name}-${album.artist}`"
        :to="`/albums/${getAlbumSlug(album)}`"
        class="group block rounded-lg bg-card transition-colors hover:bg-accent"
      >
        <div class="aspect-square overflow-hidden rounded-md bg-muted">
          <img
            v-if="album.coverUrl"
            :src="album.coverUrl"
            :alt="`${album.name} by ${album.artist}`"
            class="h-full w-full object-cover transition-transform group-hover:scale-105"
            @error="(e: Event) => { const target = e.target as HTMLImageElement; if (target) target.style.display = 'none' }"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center text-4xl text-muted-foreground"
          >
            <UIcon name="i-lucide-music" />
          </div>
        </div>
        <div class="mt-2 space-y-1">
          <h3 class="truncate text-sm font-medium leading-none">
            {{ album.name }}
          </h3>
          <p class="truncate text-xs text-muted-foreground">
            {{ album.artist }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ album.songs.length }} song{{ album.songs.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </UPage>
</template>
