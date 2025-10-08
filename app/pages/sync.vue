<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })

  useSeoMeta({
    title: 'Sync Library',
    description:
      'Synchronize your music library with uploaded files. Scan and add missing files to your Home Stream collection.',
    ogTitle: 'Sync Library - Home Stream',
    ogDescription:
      'Synchronize your music library with uploaded files on Home Stream.',
    robots:
      'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
    twitterCard: 'summary',
    twitterTitle: 'Sync Library - Home Stream',
    twitterDescription:
      'Synchronize your music library with uploaded files on Home Stream.',
  })
  const toast = useToast()

  const syncing = ref(false)
  const summary = ref<{
    inserted: number
    skipped: number
    failed: number
  } | null>(null)
  const results = ref<
    Array<{
      file: string
      status: 'inserted' | 'skipped' | 'failed'
      reason?: string
    }>
  >([])

  const runSync = async () => {
    summary.value = null
    results.value = []
    syncing.value = true
    try {
      const res = (await $fetch('/api/sync', {
        method: 'POST',
        credentials: 'include',
        headers: useRequestHeaders(['cookie']),
      })) as {
        summary: { inserted: number; skipped: number; failed: number }
        results: Array<{
          file: string
          status: 'inserted' | 'skipped' | 'failed'
          reason?: string
        }>
      }
      summary.value = res.summary
      results.value = res.results
    } catch (e: any) {
      toast.add({
        title: 'Error',
        description: e?.message || 'Sync failed',
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
    } finally {
      syncing.value = false
    }
  }
</script>

<template>
  <div class="grid w-full gap-4">
    <div class="grid gap-4">
      <h1 class="font-serif text-2xl">Sync Library</h1>
      <p class="text-sm text-neutral-500">
        Scan
        <code>storage/uploads/music</code>
        and add any missing files to your library.
      </p>
    </div>

    <div class="grid gap-3">
      <UButton
        :loading="syncing"
        icon="i-lucide-refresh-ccw"
        class="justify-center"
        @click="runSync"
      >
        Sync now
      </UButton>
      <span v-if="summary" class="text-sm text-neutral-600">
        Inserted:
        <strong>{{ summary.inserted }}</strong>
        , Skipped:
        <strong>{{ summary.skipped }}</strong>
        , Failed:
        <strong>{{ summary.failed }}</strong>
      </span>
    </div>

    <div v-if="results.length" class="mt-4 overflow-hidden rounded-lg border">
      <table class="w-full text-sm">
        <thead class="">
          <tr>
            <th class="px-3 py-2 text-left font-medium">File</th>
            <th class="px-3 py-2 text-left font-medium">Status</th>
            <th class="px-3 py-2 text-left font-medium">Reason</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in results" :key="row.file" class="border-t">
            <td class="px-3 py-2 text-xs">{{ row.file }}</td>
            <td class="px-3 py-2 text-xs">
              <UBadge
                :color="
                  row.status === 'inserted'
                    ? 'green'
                    : row.status === 'skipped'
                      ? 'gray'
                      : 'red'
                "
              >
                {{ row.status }}
              </UBadge>
            </td>
            <td class="px-3 py-2 text-xs">{{ row.reason || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
