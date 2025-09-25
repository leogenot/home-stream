<script setup lang="ts">
  definePageMeta({ title: 'Home Stream' })
  useHead({
    title: 'Music',
  })
  const { user } = useSupabaseAuth()
  const { refreshUserData } = useUser()
  const router = useRouter()

  onMounted(() => {
    if (user.value) {
      // Refresh user data to ensure subscription status is current
      refreshUserData()
    } else {
      router.push('/auth/login')
    }
  })
  const { songs } = useMusic()
  const { playAllNow, playAllRandomNow, playSong, addToQueue } = useQueue()
</script>

<template>
  <div class="grid w-full gap-6">
    <div>
      <h2 class="font-serif text-2xl">Music</h2>
    </div>

    <div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            class="border border-black/40 px-3 py-1 text-sm"
            @click="playAllNow(songs)"
          >
            Play All
          </button>
          <button
            class="border border-black/40 px-3 py-1 text-sm"
            @click="playAllRandomNow(songs)"
          >
            Random
          </button>
        </div>
      </div>
      <div
        v-for="(song, i) in songs"
        :key="song.id"
        class="my-6 flex max-w-screen flex-wrap items-center justify-between gap-3"
      >
        <div class="truncate font-serif text-sm" @click="playSong(i, songs)">
          {{ song.file }}
        </div>
        <div class="flex items-center gap-2">
          <button
            class="border border-black/40 px-2 py-1 text-xs"
            @click="playSong(i, songs)"
          >
            Play
          </button>
          <button
            class="border border-black/40 px-2 py-1 text-xs"
            @click="addToQueue(song)"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
