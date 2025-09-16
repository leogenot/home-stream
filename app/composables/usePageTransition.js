export const usePageTransitionRunning = ref(false)

const transitionController = (
    router,
    transitions,
    defaultTransition,
    globalHooks,
    endpointData = ref(null),
) => {
    // if (process.client && window.innerWidth < 600) return

    const get = (from, type, ...args) => {
        if (from?.name && !transitions[from?.name]) {
            console.log(`no transition named: ${from?.name}. add it to usePageTransition.transitions`)
        }

        if (!from?.name || !type || !transitions[from?.name]) {
            // no page transition if there's no default transition
            if (!defaultTransition) return null

            const defaultTransitionCurrentHook = defaultTransition[type]

            // no transition-hook if the default doesn't define one
            if (!defaultTransitionCurrentHook) return null

            // run default transition's hook
            return defaultTransitionCurrentHook(...args, from?.payload)
        }

        // get the chosen transition's hook
        const handler = transitions[from.name][type]

        // run the chosen transition's hook
        return typeof handler === 'function' ? handler(...args, from?.payload) : null
    }

    return {
        onBeforeLeave: (el) => {
            const transition = unref(router.transition)
            usePageTransitionRunning.value = true

            runIfDefined(globalHooks.onBeforeLeave, el, transition?.payload)
            get(transition, 'onBeforeLeave', el)
        },

        onLeave: async (el, done) => {
            const transition = unref(router.transition)

            try {
                runIfDefined(globalHooks.onLeave, el, transition?.payload)
                get(transition, 'onLeave', el, done)
            } catch (error) {
                console.log(error)
                done()
            }
        },

        onAfterLeave: (el) => {
            const transition = unref(router.transition)

            runIfDefined(globalHooks.onAfterLeave, el, transition?.payload)
            get(transition, 'onAfterLeave', el)
        },

        onBeforeEnter: (el) => {
            const transition = unref(router.transition)

            runIfDefined(globalHooks.onBeforeEnter, el, transition?.payload)
            get(transition, 'onBeforeEnter', el)
        },

        onEnter: async (el, done) => {
            const transition = unref(router.transition)

            await waitFor(() => endpointData.value !== 'pending')

            try {
                runIfDefined(globalHooks.onEnter, el, transition?.payload)
                get(transition, 'onEnter', el, done)
            } catch (error) {
                console.log(error)
                done()
            }
        },

        onAfterEnter: (el) => {
            const transition = unref(router.transition)

            runIfDefined(globalHooks.onAfterEnter, el, transition?.payload)
            get(transition, 'onAfterEnter', el)

            // cleanup itself
            if (router.transition) {
                router.transition = null
            }

            endpointData.value = null
            usePageTransitionRunning.value = false
        },
    }
}

export default ({
    transitions = {},
    defaultTransition = {},
    globalHooks = {},
    endpointData,
} = {}) => {
    const router = useRouter()

    router.transition = router.transition || null

    return {
        css: false,
        ...transitionController(router, transitions, defaultTransition, globalHooks, endpointData),
    }
}

function runIfDefined(fn, el, ...args) {
    return typeof fn === 'function' ? fn(el, ...args) : null
}

async function waitFor(callback) {
    return new Promise((resolve) => {
        const tick = () => {
            requestAnimationFrame(callback() ? resolve : tick)
        }
        tick()
    })
}