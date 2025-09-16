import Lenis from 'lenis'

const useLenis = () => useState('lenis', () => null)
const useCurrentScroll = () => useState('current-scroll', () => null)
const useRealScroll = () => useState('real-scroll', () => null)
const useTargetScroll = () => useState('target-scroll', () => null)
const useProgress = () => useState('progress', () => null)
const useLimit = () => useState('limit', () => 10000000)

export default (init) => {
    const lenis = useLenis()
    const currentScroll = useCurrentScroll()
    const realScroll = useRealScroll()
    const targetScroll = useTargetScroll()
    const progress = useProgress()
    const limit = useLimit()

    const ENABLE_SMOOTHSCROLL = true

    function updateStateVariables(lenis) {
        currentScroll.value = lenis.animatedScroll
        realScroll.value = lenis.actualScroll
        targetScroll.value = lenis.targetScroll
        progress.value = lenis.progress
        limit.value = lenis.limit
    }

    if (init && import.meta.client) {
        if (ENABLE_SMOOTHSCROLL) {
            lenis.value = new Lenis({ lerp: 0.5 })

            updateStateVariables(lenis.value)

            lenis.value.on('scroll', () => { })

            function raf(time) {
                lenis.value.raf(time)
                requestAnimationFrame(raf)
                updateStateVariables(lenis.value)
            }

            requestAnimationFrame(raf)
        } else {
            window.addEventListener('scroll', () => {
                currentScroll.value = window.scrollY
                realScroll.value = window.scrollY
                targetScroll.value = window.scrollY
            })
        }
    }

    return {
        lenis: lenis.value ? lenis : ref({ start: () => { }, stop: () => { } }),
        currentScroll,
        realScroll,
        targetScroll,
        progress,
        limit,
    }
}