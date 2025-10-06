<script setup lang="ts">
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const toast = useToast()

  const sign = ref<'in' | 'up'>('in')

  const route = useRoute()
  const redirect = computed(() =>
    typeof route.query.redirect === 'string' ? route.query.redirect : '/',
  )

  watchEffect(() => {
    if (user.value) {
      return navigateTo(redirect.value)
    }
  })

  const fields = [
    {
      name: 'email',
      type: 'text' as const,
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password' as const,
      placeholder: 'Enter your password',
    },
  ]

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) displayError(error)
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) displayError(error)
    else {
      toast.add({
        title: 'Sign up successful',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
      await signIn(email, password)
    }
  }

  async function onSubmit(payload: {
    data: { email: string; password: string }
  }) {
    const email = payload.data.email
    const password = payload.data.password

    if (sign.value === 'in') await signIn(email, password)
    else await signUp(email, password)
  }

  const displayError = (error: { message: string }) => {
    toast.add({
      title: 'Error',
      description: error.message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
</script>

<template>
  <UContainer
    class="flex h-[calc(100vh-var(--ui-header-height))] items-center justify-center px-4"
  >
    <UPageCard class="w-full max-w-sm">
      <UAuthForm
        :title="sign === 'in' ? 'Login' : 'Sign up'"
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #description>
          {{
            sign === 'up'
              ? 'Already have an account?'
              : "Don't have an account?"
          }}
          <UButton
            variant="link"
            class="p-0"
            @click="sign = sign === 'up' ? 'in' : 'up'"
          >
            {{ sign === 'in' ? 'Sign up' : 'Sign in' }}
          </UButton>
          .
        </template>
      </UAuthForm>
    </UPageCard>
  </UContainer>
</template>
