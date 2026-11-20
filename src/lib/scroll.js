import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initScroll() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
        lerp: 0.1,
        anchors: { offset: -80 },
            prevent: () => document.documentElement.classList.contains('admin-mode'),
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
}