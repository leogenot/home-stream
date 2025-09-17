<script setup lang="ts">
  useHead({
    title: 'Profile | supaAuth',
  })

  const user = useSupabaseUser()
  const client = useSupabaseClient()

  // Profile state
  const loading = ref(false)
  const updateError = ref('')
  const updateSuccess = ref('')
  const fullName = ref('')
  const email = ref('')

  const fetchPlaylists = async () => {
    if (!user.value) return
    const { data, error } = await client
      .from('playlists')
      .select(
        `
      id,
      title,
      media_type,
      created_at,
      playlist_items (
        id,
        position,
        music_id,
        movie_id,
        music (id, file),
        movies (id, title)
      )
    `,
      )
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      playlists.value = data
    }
  }

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

  // Pre-fill user data
  watchEffect(() => {
    if (user.value) {
      email.value = user.value.email || ''
      fullName.value = (user.value.user_metadata?.full_name as string) || ''
      fetchPlaylists()
    }
  })

  const updateProfile = async () => {
    loading.value = true
    updateError.value = ''
    updateSuccess.value = ''

    try {
      const { error } = await client.auth.updateUser({
        email: email.value,
        data: { full_name: fullName.value },
      })
      if (error) throw error
      updateSuccess.value = 'Profile updated successfully!'
    } catch (err: any) {
      updateError.value = err.message
    } finally {
      loading.value = false
      setTimeout(() => {
        updateError.value = ''
        updateSuccess.value = ''
      }, 5000)
    }
  }

  const clearError = () => {
    updateError.value = ''
  }

  // Playlist + files state
  const playlists = ref<any[]>([])
  const musics = ref<any[]>([])
  const files = ref<any[]>([])
  const selectedFileIds = ref<number[]>([])
  const newPlaylistTitle = ref('')
  const newPlaylistDescription = ref('')
  const playlistSuccess = ref('')
  const playlistError = ref('')

  // Upload state
  const fileInput = ref<HTMLInputElement | null>(null)
  const uploadError = ref('')
  const uploadSuccess = ref('')
  const uploading = ref(false)

  const fetchFiles = async () => {
    const { data, error } = await client
      .from('music')
      .select('id, file')
      .order('created_at', { ascending: false })

    if (!error && data) {
      files.value = data
    }
  }

  const uploadFile = async () => {
    if (!fileInput.value?.files?.length) return

    const formData = new FormData()
    Array.from(fileInput.value.files).forEach((file) => {
      formData.append('files', file)
    })

    uploading.value = true
    try {
      const res = await $fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.error) throw new Error(res.error)

      uploadSuccess.value = 'Files uploaded successfully!'
      fetchMusics()
    } catch (err: any) {
      uploadError.value = err.message
    } finally {
      uploading.value = false
      setTimeout(() => {
        uploadError.value = ''
        uploadSuccess.value = ''
      }, 5000)
    }
  }

  const createPlaylist = async () => {
    playlistError.value = ''
    playlistSuccess.value = ''

    if (!user.value) return

    try {
      // Create the playlist
      const { data: playlistData, error: playlistErrorInsert } = await client
        .from('playlists')
        .insert({
          title: newPlaylistTitle.value,
          user_id: user.value.id,
          media_type: 'music',
        })
        .select()
        .single()
      if (playlistErrorInsert) throw playlistErrorInsert

      const playlistId = playlistData.id

      // Insert items into playlist_items
      const playlistItems = selectedFileIds.value.map((musicId, index) => ({
        playlist_id: playlistId,
        music_id: musicId,
        position: index + 1,
      }))

      if (playlistItems.length) {
        const { error: itemsError } = await client
          .from('playlist_items')
          .insert(playlistItems)
        if (itemsError) throw itemsError
      }

      playlistSuccess.value = 'Playlist created!'
      newPlaylistTitle.value = ''
      selectedFileIds.value = []
      fetchPlaylists()
    } catch (err: any) {
      playlistError.value = err.message
    }
  }

  // Delete an entire playlist
  const deletePlaylist = async (playlistId: number) => {
    playlistError.value = ''
    playlistSuccess.value = ''

    try {
      // Delete playlist items first
      const { error: itemsError } = await client
        .from('playlist_items')
        .delete()
        .eq('playlist_id', playlistId)
      if (itemsError) throw itemsError

      // Delete the playlist itself
      const { error: playlistDeleteError } = await client
        .from('playlists')
        .delete()
        .eq('id', playlistId)
      if (playlistDeleteError) throw playlistDeleteError

      playlistSuccess.value = 'Playlist deleted successfully!'
      fetchPlaylists()
    } catch (err: any) {
      playlistError.value = err.message
    }
  }

  // Add item(s) to a playlist
  const addItemsToPlaylist = async (playlistId: number, fileIds: number[]) => {
    try {
      const currentItems =
        playlists.value.find((p) => p.id === playlistId)?.playlist_items || []
      const startPosition = currentItems.length + 1

      const playlistItems = fileIds.map((musicId, index) => ({
        playlist_id: playlistId,
        music_id: musicId,
        position: startPosition + index,
      }))

      if (playlistItems.length) {
        const { error } = await client
          .from('playlist_items')
          .insert(playlistItems)
        if (error) throw error
      }

      playlistSuccess.value = 'Items added to playlist!'
      fetchPlaylists()
    } catch (err: any) {
      playlistError.value = err.message
    }
  }

  // Remove item from a playlist
  const removeItemFromPlaylist = async (itemId: number) => {
    try {
      const { error } = await client
        .from('playlist_items')
        .delete()
        .eq('id', itemId)
      if (error) throw error

      playlistSuccess.value = 'Item removed from playlist!'
      fetchPlaylists()
    } catch (err: any) {
      playlistError.value = err.message
    }
  }

  onMounted(() => {
    fetchFiles()
    fetchPlaylists()
    fetchMusics()
  })
</script>

<template>
  <div class="mx-auto grid w-fit gap-8">
    <!-- Profile -->
    <section class="grid gap-4">
      <h1 class="font-serif text-3xl">Edit Profile</h1>

      <form
        class="grid items-center justify-items-center gap-4"
        @submit.prevent="updateProfile"
      >
        <ErrorAlert :error-msg="updateError" @clear-error="clearError" />
        <p v-if="updateSuccess" class="text-green-600">{{ updateSuccess }}</p>

        <label>
          <input
            v-model="fullName"
            class="border border-(--sand) p-2 uppercase"
            type="text"
            placeholder="Full Name"
          />
        </label>
        <label>
          <input
            v-model="email"
            class="border border-(--sand) p-2 uppercase"
            type="email"
            placeholder="Email Address"
          />
        </label>

        <button
          class="cursor-pointer border border-(--sand) p-2 uppercase"
          type="submit"
          :disabled="loading"
        >
          <div :class="{ 'pointer-events-none opacity-50': loading }">
            Save Changes
          </div>
        </button>
      </form>
    </section>

    <form
      class="grid gap-4"
      enctype="multipart/form-data"
      @submit.prevent="uploadFile"
    >
      <h2 class="font-serif text-xl">Upload File</h2>
      <input
        ref="fileInput"
        class="border border-(--sand) p-2 uppercase"
        type="file"
        name="files"
        multiple
        required
      />
      <button
        type="submit"
        class="cursor-pointer border border-(--sand) p-2 uppercase"
      >
        Upload
      </button>
      <p v-if="uploadError" class="text-red-600">{{ uploadError }}</p>
      <p v-if="uploadSuccess" class="text-green-600">{{ uploadSuccess }}</p>
    </form>

    <!-- Create Playlist -->
    <div>
      <h2 class="font-serif text-xl">Create Playlist</h2>
      <form class="grid gap-2" @submit.prevent="createPlaylist">
        <input
          v-model="newPlaylistTitle"
          class="border border-(--sand) p-2 uppercase"
          placeholder="Title"
          required
        />
        <textarea
          v-model="newPlaylistDescription"
          class="border border-(--sand) p-2 uppercase"
          placeholder="Description"
        />

        <select
          v-model="selectedFileIds"
          multiple
          class="border border-(--sand) p-2 uppercase"
        >
          <option v-for="file in files" :key="file.id" :value="file.id">
            {{ file.file }}
          </option>
        </select>

        <button
          type="submit"
          class="cursor-pointer border border-(--sand) p-2 uppercase"
        >
          Create
        </button>
      </form>
      <p v-if="playlistError" class="text-red-600">{{ playlistError }}</p>
      <p v-if="playlistSuccess" class="text-green-600">{{ playlistSuccess }}</p>
    </div>

    <div v-if="playlists.length" class="mt-4 grid gap-2">
      <div
        v-for="pl in playlists"
        :key="pl.id"
        class="border border-(--sand) p-2"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-serif text-lg">{{ pl.title }}</h3>
          <button class="text-sm text-red-600" @click="deletePlaylist(pl.id)">
            Delete Playlist
          </button>
        </div>
        <p class="text-xs">Media type: {{ pl.media_type }}</p>

        <ul v-if="pl.playlist_items?.length">
          <li
            v-for="item in pl.playlist_items"
            :key="item.id"
            class="flex items-center justify-between"
          >
            {{ item.music?.file || item.movies?.title || 'Unknown' }}
            <button
              class="text-xs text-red-500"
              @click="removeItemFromPlaylist(item.id)"
            >
              Remove
            </button>
          </li>
        </ul>
        <p v-else class="text-gray-500">No items in this playlist.</p>

        <!-- Add items to playlist -->
        <div class="mt-2">
          <select
            v-model="selectedFileIds"
            multiple
            class="border border-(--sand) p-2 uppercase"
          >
            <option v-for="file in files" :key="file.id" :value="file.id">
              {{ file.file }}
            </option>
          </select>
          <button
            class="mt-1 border border-(--sand) p-2 text-sm"
            @click.prevent="addItemsToPlaylist(pl.id, selectedFileIds)"
          >
            Add Selected Items
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500">No playlists yet.</p>
    <div>
      <div v-if="musics.length" class="mt-4 grid gap-2">
        <div
          v-for="pl in musics"
          :key="pl.id"
          class="border border-(--sand) p-2"
        >
          <h3 class="font-serif text-lg">{{ pl.file }}</h3>
        </div>
      </div>
      <p v-else class="text-gray-500">No uploaded music yet.</p>
    </div>
  </div>
</template>
