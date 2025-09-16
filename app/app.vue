<script lang="ts" setup>
  import useSmoothScroll from './composables/useSmoothScroll'
  import usePageTransition from './composables/usePageTransition'
  import { useSupabaseAuth } from './composables/useSupabaseAuth'
  import fallback from './transitions/fallback'

  const { initAuthListener, unsubscribeAuthListener } = useSupabaseAuth()
  const usePageIsTransitioning = () =>
    useState('page-is-transitioning', () => false)
  const pageIsTransitioning = usePageIsTransitioning()

  const { currentScroll } = useSmoothScroll(true)
  // const isTransitioning = ref(false)

  const pageTransitions = usePageTransition({
    defaultTransition: fallback,
    globalHooks: {
      onBeforeLeave(el: {
        style: { position: string; width: string; left: number; top: string }
      }) {
        pageIsTransitioning.value = true

        // place the old page in the place it was,
        // so it's safe to scroll to the top
        el.style.position = 'fixed'
        el.style.width = '100vw'
        el.style.left = 0
        el.style.top =
          currentScroll.value !== null ? currentScroll.value * -1 + 'px' : '0px'
      },
      onAfterEnter(el: { removeAttribute: (arg0: string) => void }) {
        pageIsTransitioning.value = false
        el.removeAttribute('style')
      },
    },
  })

  onMounted(async () => {
    await initAuthListener()
  })

  onUnmounted(() => {
    unsubscribeAuthListener()
  })
</script>

<template>
  <div>
    <SiteHeader />
    <NuxtLayout>
      <DevGrid />
      <NuxtPage :transition="pageTransitions" />
      <ElementsErrorMessage />
    </NuxtLayout>
  </div>
</template>

<style lang="postcss">
  .fade-leave-active,
  .fade-enter-active {
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
