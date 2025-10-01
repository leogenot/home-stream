<template>
  <div>
    <UContainer class="border-default pt-10 pb-16 sm:border-x">
      <slot />
      <floaty-player />
      <AppHeader :links="navLinks" />
    </UContainer>
  </div>
</template>
