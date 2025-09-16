<script setup>
  const { user } = useSupabaseAuth()
  const { setCurrentError } = useErrorMessage()
  const route = useRoute()
  const router = useRouter()
  const visibleModal = ref(false)
  const currentView = ref('details')
  const loading = ref(true)

  const { userData, refreshUserData } = useUser()

  const items = computed(() => {
    const nav = [
      {
        title: 'Account details',
        to: '/account/profile?view=details',
      },
    ]

    return [...nav]
  })

  const checkRoute = () => {
    visibleModal.value = !!route.query['view']
  }

  watch(
    () => route.query,
    (query) => {
      currentView.value = query?.view || 'details'
    },
    { immediate: true },
  )

  onMounted(() => {
    checkRoute()

    if (user.value) {
      // Refresh user data to ensure subscription status is current
      refreshUserData()
    } else {
      router.push('/account/login')
    }
  })
</script>

<template>
  <div v-if="user" class="flex min-h-screen flex-col justify-between">
    <div>
      <div v-if="currentView == 'details'" class="grid gap-15 pt-10 pb-40">
        <FormsUpdateUser
          v-bind="{ ...userData, userId: user.id }"
          @data-changed="userData = $event[0]"
        />
        <FormsResetPassword />
      </div>
    </div>
    <SiteFooter />
  </div>
</template>
