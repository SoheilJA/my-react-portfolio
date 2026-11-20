import gsap from 'gsap'

export const float = {
    mounted(el, binding) {
        el._tween = gsap.to(el, {
            y: binding.value || 12,
            duration: 2 + Math.random(),
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
        })
    },
    unmounted(el) {
        el._tween?.kill()
    },
}