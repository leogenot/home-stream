<template>
  <div>
    <UContainer class="border-default safe-x px-2 pt-10 sm:border-x">
      <slot />
      <floaty-player />
      <AppHeader :links="navLinks" />
    </UContainer>
  </div>
</template>
