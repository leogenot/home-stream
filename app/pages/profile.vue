<script setup lang="ts">
  useHead({
    title: 'Profile | supaAuth',
  })

  const user = useSupabaseUser()
  const client = useSupabaseClient()

  const loading = ref(false)
  const updateError = ref('')
  const updateSuccess = ref('')

  const fullName = ref('')
  const email = ref('')

  // Pre-fill fields with current user data
  watchEffect(() => {
    if (user.value) {
      email.value = user.value.email || ''
      fullName.value = (user.value.user_metadata?.full_name as string) || ''
    }
  })

  const updateProfile = async () => {
    loading.value = true
    updateError.value = ''
    updateSuccess.value = ''

    try {
      // Update auth user (email) and metadata (full_name)
      const { error } = await client.auth.updateUser({
        email: email.value,
        data: { full_name: fullName.value },
      })

      if (error) throw error
      updateSuccess.value = 'Profile updated successfully!'
    } catch (err: any) {
      updateError.value = err.message
    } finally {
      loading.value = false
      setTimeout(() => {
        updateError.value = ''
        updateSuccess.value = ''
      }, 5000)
    }
  }

  const clearError = () => {
    updateError.value = ''
  }
</script>

<template>
  <div class="mx-auto grid w-fit items-center justify-center gap-4">
    <h1 class="font-serif text-3xl">Edit Profile</h1>

    <form
      class="grid items-center justify-items-center gap-4"
      @submit.prevent="updateProfile"
    >
      <ErrorAlert :error-msg="updateError" @clear-error="clearError" />
      <p v-if="updateSuccess" class="text-green-600">{{ updateSuccess }}</p>

      <div class="grid gap-4">
        <label>
          <input
            v-model="fullName"
            class="border border-(--sand) p-2 uppercase"
            type="text"
            placeholder="Full Name"
          />
        </label>
        <label>
          <input
            v-model="email"
            class="border border-(--sand) p-2 uppercase"
            type="email"
            placeholder="Email Address"
          />
        </label>
      </div>

      <div class="grid gap-4">
        <button
          class="cursor-pointer border border-(--sand) p-2 uppercase"
          type="submit"
          :disabled="loading"
        >
          <div :class="{ 'pointer-events-none opacity-50': loading }">
            Save Changes
          </div>
        </button>
      </div>
    </form>
  </div>
</template>
