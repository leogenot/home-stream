<script setup lang="ts">
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  const currentTab = ref<'music' | 'movies'>('music')
  const files = ref<unknown[]>([])

  const fetchFiles = async () => {
    if (!user.value) return
    const { data, error } = await client
      .from(currentTab.value)
      .select('id, file, created_at')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      files.value = data
    }
  }

  const changeTab = (tab: 'music' | 'movies') => {
    currentTab.value = tab
    fetchFiles()
  }

  // Upload state
  const fileInput = ref<HTMLInputElement | null>(null)
  const uploadError = ref('')
  const uploadSuccess = ref('')
  const uploading = ref(false)

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
      fetchFiles()
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

  const deleteFile = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const res = await $fetch('/api/deleteFile', {
        method: 'POST',
        body: { filename, table: currentTab.value },
      })

      if (res.error) throw new Error(res.error)

      fetchFiles()
    } catch (err: any) {
      alert(err.message || 'Failed to delete file')
    }
  }

  onMounted(() => {
    fetchFiles()
  })
</script>

<template>
  <div class="grid w-fit gap-8">
    <!-- Tabs -->
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

    <!-- Upload form -->
    <form
      class="grid gap-4"
      enctype="multipart/form-data"
      @submit.prevent="uploadFile"
    >
      <h2 class="font-serif text-xl">Upload {{ currentTab }}</h2>
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

    <!-- Files list -->
    <div>
      <h2>Uploaded {{ currentTab }}:</h2>
      <div v-if="files.length" class="mt-4 grid gap-2">
        <div
          v-for="pl in files"
          :key="pl.id"
          class="flex items-center justify-between border border-(--sand) p-2"
        >
          <h3 class="font-serif text-lg">{{ pl.file }}</h3>
          <button
            class="text-red-600 hover:underline"
            @click="deleteFile(pl.file)"
          >
            Delete
          </button>
        </div>
      </div>
      <p v-else class="text-gray-500">No uploaded {{ currentTab }} yet.</p>
    </div>
  </div>
</template>
