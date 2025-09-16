<template>
  <div class="flex h-6 items-center justify-center space-x-1">
    <div
      v-for="n in 3"
      :key="n"
      class="h-1.5 w-1.5 animate-bounce bg-black"
      :class="[
        n === 2 ? 'animation-delay-150' : '',
        n === 3 ? 'animation-delay-300' : '',
      ]"
    />
  </div>
</template>

<style scoped>
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  .animate-bounce {
    animation: bounce 0.6s infinite;
  }

  .animation-delay-150 {
    animation-delay: 0.15s;
  }

  .animation-delay-300 {
    animation-delay: 0.3s;
  }
</style>
