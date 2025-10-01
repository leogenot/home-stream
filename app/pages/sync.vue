<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const syncing = ref(false)
const error = ref('')
const summary = ref<{ inserted: number; skipped: number; failed: number } | null>(null)
const results = ref<Array<{ file: string; status: 'inserted' | 'skipped' | 'failed'; reason?: string }>>([])

const runSync = async () => {
  error.value = ''
  summary.value = null
  results.value = []
  syncing.value = true
  try {
    const res = await $fetch('/api/sync', {
      method: 'POST',
      credentials: 'include',
      headers: useRequestHeaders(['cookie']),
    }) as { summary: { inserted: number; skipped: number; failed: number }, results: Array<{ file: string; status: 'inserted' | 'skipped' | 'failed'; reason?: string }> }
    summary.value = res.summary
    results.value = res.results
  } catch (e: any) {
    error.value = e?.message || 'Sync failed'
  } finally {
    syncing.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl p-4 space-y-4">
    <AppHeader/>

    <div class="rounded-xl border p-4">
      <h1 class="mb-2 text-2xl font-semibold">Sync Library</h1>
      <p class="mb-4 text-sm text-neutral-500">Scan <code>public/uploads/music</code> and add any missing files to your library.</p>

      <div class="flex items-center gap-3">
        <UButton :loading="syncing" icon="i-lucide-refresh-ccw" @click="runSync">
          Sync now
        </UButton>
        <span v-if="summary" class="text-sm text-neutral-600">
          Inserted: <strong>{{ summary.inserted }}</strong>, Skipped: <strong>{{ summary.skipped }}</strong>, Failed: <strong>{{ summary.failed }}</strong>
        </span>
      </div>

      <ErrorAlert v-if="error" class="mt-4">{{ error }}</ErrorAlert>

      <div v-if="results.length" class="mt-4 overflow-hidden rounded-lg border">
        <table class="w-full text-sm">
          <thead class="bg-neutral-50">
            <tr>
              <th class="px-3 py-2 text-left font-medium">File</th>
              <th class="px-3 py-2 text-left font-medium">Status</th>
              <th class="px-3 py-2 text-left font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in results" :key="row.file" class="border-t">
              <td class="px-3 py-2">{{ row.file }}</td>
              <td class="px-3 py-2">
                <UBadge :color="row.status === 'inserted' ? 'green' : row.status === 'skipped' ? 'gray' : 'red'">
                  {{ row.status }}
                </UBadge>
              </td>
              <td class="px-3 py-2">{{ row.reason || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


