<script setup lang="ts">
  const route = useRoute()
  const currentRoute = computed(() => {
    return route.meta.title
  })
</script>

<template>
  <div class="px-bleed pt-4">
    <nav class="header gap-gap inline-flex w-full items-center">
      <nuxt-link
        to="/auth/login"
        class="go-back w-cols-1 h-fit shrink-0 text-sm lg:w-fit"
        :class="{ invisible: currentRoute === 'Login' }"
      >
        <span class="icon"></span>
        <span>Back</span>
      </nuxt-link>
      <h1 class="current-route w-cols-2 text-center font-serif text-xl">
        {{ currentRoute }}
      </h1>
    </nav>
    <div class="pt-16">
      <slot />
    </div>
  </div>
</template>
