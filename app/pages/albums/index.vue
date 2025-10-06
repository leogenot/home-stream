<script setup lang="ts">
  import useAlbums from '~/composables/useAlbums'

  definePageMeta({
    // middleware: 'auth',
  })

  const { refreshUserData } = useUser()
  const { albums, getAlbumSlug } = useAlbums()

  onMounted(() => {
    // Refresh user data to ensure subscription status is current
    refreshUserData()
  })

  useSeoMeta({
    title: 'Albums',
    description:
      'Browse your music collection by albums. Discover and play your favorite albums organized by artist.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    ogTitle: 'Albums - Home Stream',
    ogDescription: 'Browse your music collection by albums on Home Stream.',
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: 'Albums - Home Stream',
    twitterDescription:
      'Browse your music collection by albums on Home Stream.',
  })
</script>

<template>
  <UPage>
    <div class="flex justify-between pb-1">
      <h2 class="font-serif text-2xl">Albums</h2>
    </div>
    <USeparator />

    <div
      v-if="albums.length === 0"
      class="text-muted-foreground py-8 text-center"
    >
      <p>No albums found</p>
    </div>

    <div
      v-else
      class="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <NuxtLink
        v-for="album in albums"
        :key="`${album.name}-${album.artist}`"
        :to="`/albums/${getAlbumSlug(album)}`"
        class="group bg-card hover:bg-accent block rounded-lg transition-colors"
      >
        <div class="bg-muted aspect-square overflow-hidden rounded-md">
          <img
            v-if="album.coverUrl"
            :src="album.coverUrl"
            :alt="`${album.name} by ${album.artist}`"
            class="h-full w-full object-cover transition-transform group-hover:scale-105"
            @error="
              (e: Event) => {
                const target = e.target as HTMLImageElement
                if (target) target.style.display = 'none'
              }
            "
          />
          <div
            v-else
            class="text-muted-foreground flex h-full w-full items-center justify-center text-4xl"
          >
            <UIcon name="i-lucide-music" />
          </div>
        </div>
        <div class="mt-2 space-y-1">
          <h3 class="truncate text-sm leading-none font-medium">
            {{ album.name }}
          </h3>
          <p class="text-muted-foreground truncate text-xs">
            {{ album.artist }}
          </p>
          <p class="text-muted-foreground text-xs">
            {{ album.songs.length }} song{{
              album.songs.length !== 1 ? 's' : ''
            }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </UPage>
</template>
