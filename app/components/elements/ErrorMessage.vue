<script setup>
  import useErrorMessage from '~/composables/useErrorMessage'
  const { errorMessage, setCurrentError } = useErrorMessage()

  onMounted(() => {
    const duration = 10000

    const timer = setTimeout(() => {
      setCurrentError(null)
      clearTimeout(timer)
    }, duration)
  })
</script>

<template>
  <div
    v-if="errorMessage"
    class="bottom-bleed right-bleed fixed z-50 flex flex-col gap-1 border bg-(--white) px-3 py-3 text-(--red) lg:w-(--cols-3)"
  >
    <span class="absolute top-0 left-0 h-full w-full bg-(--red)/15" />
    <p class="text-sm">Something went wrong</p>
    <p class="text-sm">{{ errorMessage }}</p>
  </div>
</template>
