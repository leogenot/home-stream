<script setup>
  const { progress, currentScroll } = useSmoothScroll()

  const footerRef = ref(null)
  const translateY = ref(100)
  const opacity = ref(0)

  const ease = (from, to, factor = 0.1) => from + (to - from) * factor

  const animateFooter = () => {
    if (!footerRef.value) return

    const footer = footerRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight

    const visible = footer.top < windowHeight
    if (visible) {
      const localProgress = Math.min(
        1,
        (windowHeight - footer.top) / footer.height,
      )

      const easedOpacity = ease(opacity.value, localProgress, 0.05)
      const easedTranslateY = ease(
        translateY.value,
        (1 - localProgress) * 200,
        0.05,
      )

      // Threshold to avoid near-zero values
      opacity.value = easedOpacity < 0.001 ? 0 : easedOpacity
      translateY.value = easedTranslateY < 0.001 ? 0 : easedTranslateY
    }
  }

  onMounted(() => {
    const loop = () => {
      animateFooter()
      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  })
</script>

<template>
  <div ref="footerRef" class="g-site-footer relative overflow-hidden">
    <footer
      class="w-full border-t border-(--white)/20 bg-(--black) text-(--white) transition-transform duration-200 ease-out"
      :style="{ transform: `translate(0%, ${translateY}px)` }"
    >
      <div :style="{ opacity: opacity }">
        <div class="px-bleed lg:gap-gap grid gap-8 pt-10 pb-40 lg:grid-cols-2">
          <h4>
            <span class="text-xl font-medium uppercase">Home Stream</span>
            <span class="ml-1 font-serif text-xl italic">
              Self hosted streaming
            </span>
          </h4>
          <div class="font-serif text-lg">
            <p>Home Stream is a big middle finger to streaming services (I'm cheap)</p>
          </div>
        </div>
        <div
          class="px-bleed gap-gap grid grid-cols-2 border-t border-(--white)/20 pt-8 pb-15 text-xs uppercase lg:grid-cols-4 lg:py-5"
        >
          <div class="flex flex-col lg:flex-row gap-5 lg:col-span-2 items-start justify-start">
            <span class="text-xs font-medium lg:flex">
              @ No rights reserved
            </span>
            <span class="text-xs font-medium">
              Site by
              <a
                href="https://springsummer.dk/"
                target="_blank"
                aria-label="Go to the website of Spring/Summer"
                class="inline-flex cursor-pointer"
              >
                Léo Genot
              </a>
            </span>
          </div>
          <div
            class="flex flex-col items-center justify-between lg:col-span-2 lg:flex-row"
          >
            <ul class="flex flex-col gap-5 text-xs font-medium lg:flex-row">
              <li>
                <NuxtLink href="/movies">Movies</NuxtLink>
                <NuxtLink href="/music">Music</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>