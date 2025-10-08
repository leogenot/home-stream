export function useInfiniteScroll(
    callback: () => void,
    options: {
        distance?: number
        enabled?: Ref<boolean>
    } = {}
) {
    const { distance = 300, enabled = ref(true) } = options

    const isScrolling = ref(false)

    const handleScroll = () => {
        if (!enabled.value || isScrolling.value) return

        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = document.documentElement.scrollTop
        const clientHeight = document.documentElement.clientHeight

        // Check if user has scrolled near the bottom
        if (scrollHeight - scrollTop - clientHeight < distance) {
            isScrolling.value = true
            callback()
            // Reset flag after a short delay to prevent multiple rapid calls
            setTimeout(() => {
                isScrolling.value = false
            }, 200)
        }
    }

    onMounted(() => {
        window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
    })

    return {
        isScrolling
    }
}

