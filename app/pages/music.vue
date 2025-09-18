<script setup lang="ts">
  useHead({
    title: 'Music',
  })
  const user = useSupabaseUser()
  const client = useSupabaseClient()
  const musics = ref<any[]>([])

  const fetchMusics = async () => {
    if (!user.value) return
    const { data, error } = await client
      .from('music')
      .select('id, file, created_at')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      musics.value = data
    }
  }

  onMounted(() => {
    fetchMusics()
  })
</script>

<template>
  <div>
    <h1 class="font-serif text-3xl">Music:</h1>
    <div v-for="song in musics" :key="song.id" class="mb-4">
      <p>{{ song.file }}</p>
      <!-- Stream the music file -->
      <audio
        :src="`/uploads/${song.file}`"
        controls
        preload="none"
        class="w-full"
      ></audio>
    </div>
  </div>
</template>
