<script setup lang="ts">
  const user = useSupabaseUser()
  const router = useRouter()

  watch(
    user,
    () => {
      if (user.value) {
        return router.push('/account/profile')
      }
    },
    { immediate: true },
  )
</script>

<template>
  <div class="px-bleed flex h-screen w-screen flex-col items-center py-24">
    <div class="grid items-center justify-center gap-5">
      <h1 class="text-center font-serif text-lg italic lg:text-xl">
        You are being redirected...
      </h1>

      <span class="text-center text-sm lg:text-sm">
        In case you're not redirected in a few seconds click the link below.
      </span>
      <ElementsLink
        class="mx-auto"
        title="Click here"
        url="/account/profile"
        :underline="true"
      />
    </div>
  </div>
</template>
