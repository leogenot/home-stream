const duration = () => 300

function onLeave(el, done) {
    el.style.transition = `opacity ${duration()}ms`
    el.style.opacity = 0

    setTimeout(done, duration())
}

function onEnter(el, done) {
    el.style.opacity = 0
    setTimeout(() => {
        el.style.transition = `opacity ${duration()}ms`
        el.style.opacity = 1

        setTimeout(() => {
            done()
            el.removeAttribute('style')
        }, duration())
    })
}

export default {
    onLeave,
    onEnter,
}