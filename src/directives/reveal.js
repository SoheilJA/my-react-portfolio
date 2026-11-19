import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reveal = {
    mounted(el, binding) {
        el._tween = gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: binding.value || 0,
            ease: 'power3.out',
            scrollTrigger: {trigger: el, start: 'top 90%', once: true},
        })
    },
    unmounted(el) {
        el._tween?.scrollTrigger?.kill()
        el._tween?.kill()
    },
}