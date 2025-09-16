<script lang="ts" setup>
  const route = useRoute()

  type Link = {
    underline?: boolean
    markActive?: boolean // for navigation item - mark the active and makes it big on mobile
    linkType?: string
    title?: string
    url?: string
    target?: string
    page?: {
      title: string
      _id: string
      url: string
    }
  }

  const $line = useTemplateRef('$line')
  const animationDone = ref(false)
  const isHovering = ref(false)

  const _props = withDefaults(defineProps<Link>(), {
    linkType: undefined,
    title: '',
    url: '',
    page: undefined,
    underline: false,
    markActive: false,
    target: '_self',
  })

  const toggleLine = computed(() => {
    return !_props.underline || (route.path === _props.url && _props.markActive)
  })

  const animateLine = async () => {
    isHovering.value = true

    if (!$line.value || toggleLine.value) return

    const animation = $line.value.animate(
      [
        { transform: 'scaleX(1)' },
        { transform: 'scaleX(0.2)' },
        { transform: 'scaleX(0.2)' },
        { transform: 'scaleX(1)' },
      ],
      {
        delay: 100,
        duration: 1200,
        easing: 'ease-in-out',
        fill: 'forwards',
      },
    )

    await Promise.all([animation.finished])

    animationDone.value = true

    if (!isHovering.value) {
      $line.value.style.opacity = '0'
    }
  }
</script>
<template>
  <nuxt-link
    :to="url || page?.url"
    :target="target"
    :aria-label="`Go to page ${title || page?.title || url}`"
    :class="
      markActive ? 'text-3xl lg:text-sm lg:font-medium' : 'text-sm font-medium'
    "
    class="e-link group relative flex cursor-pointer font-sans leading-none uppercase"
    @mouseenter="animateLine"
  >
    <span
      class="absolute top-1/2 left-0 flex size-6 -translate-y-1/2 p-2 transition-opacity lg:hidden"
      :class="route.path == url && markActive ? 'opacity-100' : 'opacity-0'"
    >
      <span class="size-[6px] bg-current"></span>
    </span>
    <span
      class="flex transition-transform duration-500 select-none md:py-0.5"
      :class="
        route.path == url && markActive ? 'translate-x-6 lg:translate-x-0' : ''
      "
    >
      {{ title || page?.title || url }}
    </span>
    <span
      ref="$line"
      class="line absolute top-full left-0 flex h-px w-full origin-center bg-current"
      :class="[
        underline || (route.path == url && markActive)
          ? 'line-initial'
          : 'line-hidden scale-x-0 group-hover:scale-x-100',
      ]"
    />
  </nuxt-link>
</template>

<style scoped lang="postcss">
  .line {
    transform-origin: center;
    transition: all 300ms ease;
  }

  .line-initial {
    opacity: 0;

    @media (min-width: 1024px) {
      opacity: 1;
    }
  }
</style>
