<script setup>
  const items = [
    {
      title: 'Login',
      to: '/account/login',
    },
    {
      title: 'Register',
      to: '/account/signup',
    },
  ]
</script>

<template>
  <div class="gap-gap relative grid min-h-screen lg:grid-cols-2">
    <div
      class="px-bleed lg:w-cols-4 flex flex-col justify-center gap-10 py-10 lg:px-0 lg:py-0"
    >
      <ElementsAccountNavigation :items="items" />
      <FormsSignup />
    </div>
  </div>
</template>
