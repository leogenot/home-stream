<template>
  <div>
    <UContainer class="border-default pt-10 sm:border-x">
      <slot />
      <floaty-player />
      <AppHeader :links="navLinks" />
    </UContainer>
  </div>
</template>
