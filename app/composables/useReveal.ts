import { useIntersectionObserver } from '@vueuse/core'

export function useReveal(element?: HTMLElement | null) {
    const revealed = ref < boolean > (false)
    const finishedReveal = ref < boolean > (false)

    const { stop } = useIntersectionObserver(element, ([entry]) => {
        if (entry?.isIntersecting) {
            revealed.value = true
            stop()
        }
    })

    watch(revealed, () => {
        setTimeout(() => {
            finishedReveal.value = true
        }, 1500)
    })

    return {
        revealed,
        finishedReveal
    }
}