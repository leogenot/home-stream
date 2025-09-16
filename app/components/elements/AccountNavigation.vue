<script setup lang="ts">
  const route = useRoute()

  type Props = {
    items: {
      title: string
      to: string
    }[]
  }

  const _props = defineProps<Props>()
</script>

<template>
  <ul class="e-account-navigation flex gap-1 text-sm font-medium uppercase">
    <li v-for="(item, idx) in items" :key="item.to">
      <NuxtLink
        :to="item.to"
        class="text-(--black)"
        :class="item.to == route.fullPath ? 'opacity-100' : 'opacity-50'"
      >
        {{ item.title }}
      </NuxtLink>
      <span v-if="idx != items.length - 1" class="ml-1">/</span>
    </li>
  </ul>
</template>
