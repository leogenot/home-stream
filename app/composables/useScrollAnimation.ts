export const useScrollAnimation = (
    containerRef: Ref<HTMLElement | null>,
    options = {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
    }
) => {
    let io: IntersectionObserver | null = null

    const setupObserver = () => {
        if (!import.meta.client) return
        if (!containerRef.value) return

        // Clean up previous observer
        if (io) io.disconnect()

        // Create new observer
        io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view')
                    } else {
                        entry.target.classList.remove('in-view')
                    }
                })
            },
            {
                threshold: options.threshold,
                root: null,
                rootMargin: options.rootMargin,
            }
        )

        // Observe all direct children
        const items = containerRef.value.children
        Array.from(items).forEach((item) => {
            item.classList.remove('in-view')
            io!.observe(item)
        })
    }

    const cleanup = () => {
        if (io) {
            io.disconnect()
            io = null
        }
    }

    onMounted(() => {
        setupObserver()
    })

    // Re-setup when container ref changes or items are added
    watch(containerRef, () => {
        setupObserver()
    })

    onBeforeUnmount(() => {
        cleanup()
    })

    return {
        setupObserver,
        cleanup,
    }
}

