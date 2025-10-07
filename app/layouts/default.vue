<script setup lang="ts">
  import { navLinks } from '~/utils/links'
  const user = useSupabaseUser()
</script>

<template>
  <div>
    <UContainer class="border-default safe-x px-2 pt-10 sm:border-x">
      <slot />
      <floaty-player />
      <AppHeader v-if="user" :links="navLinks" />
    </UContainer>
  </div>
</template>
