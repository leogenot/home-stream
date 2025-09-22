<script setup>
  import { useMagicKeys } from '@vueuse/core'

  const visibleDevGrid = ref(false)
  const keys = useMagicKeys()
  const ctrlG = keys['Ctrl+G']

  watchEffect(() => {
    if (ctrlG.value) {
      visibleDevGrid.value = !visibleDevGrid.value
    }
  })
</script>

<template>
  <div v-if="visibleDevGrid" class="dev-grid">
    <div v-for="idx in 12" :key="idx" class="col">{{ idx }}</div>
  </div>
</template>

<style lang="postcss">
  .dev-grid {
    position: fixed;
    width: calc(100vw - var(--grid-bleed) * 2);
    height: 100vh;
    top: 0;
    left: 0;

    display: grid;
    grid-template-columns: repeat(var(--grid-cols), 1fr);
    gap: var(--grid-gap);
    margin: 0 var(--grid-bleed);

    pointer-events: none;

    z-index: 1000;

    .col {
      --color: 195, 53%, 79%;

      color: hsla(var(--color), 1);
      background: hsla(var(--color), 0.4);
      border-left: 1px solid hsla(var(--color), 0.8);
      border-right: 1px solid hsla(var(--color), 0.8);

      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 900px) {
        &:nth-child(n + 5) {
          display: none;
        }
      }
    }
  }
</style>
