import gsap from 'gsap'

export const magnetic = {
    mounted(el, binding) {
        if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const strength = binding.value || 0.3
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

        el._move = (e) => {
            const r = el.getBoundingClientRect()
            xTo((e.clientX - (r.left + r.width / 2)) * strength)
            yTo((e.clientY - (r.top + r.height / 2)) * strength)
        }
        el._leave = () => {
            xTo(0)
            yTo(0)
        }
        el.addEventListener('pointermove', el._move)
        el.addEventListener('pointerleave', el._leave)
    },
    unmounted(el) {
        if (!el._move) return
        el.removeEventListener('pointermove', el._move)
        el.removeEventListener('pointerleave', el._leave)
        gsap.killTweensOf(el)
    },
}