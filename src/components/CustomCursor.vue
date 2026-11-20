<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

const ring = ref(null)
const enabled = ref(false)
let cleanup = () => {}

onMounted(async () => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  enabled.value = true
  await nextTick()

  const el = ring.value
  gsap.set(el, { xPercent: -50, yPercent: -50 })
  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })

  const move = (e) => {
    xTo(e.clientX)
    yTo(e.clientY)
    el.style.opacity = 1
  }
  const over = (e) => {
    const hot = e.target.closest('a, button, [role="button"], input, textarea, select')
    gsap.to(el, { scale: hot ? 1.8 : 1, duration: 0.3 })
  }
  const leave = () => (el.style.opacity = 0)

  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerover', over)
  document.documentElement.addEventListener('pointerleave', leave)

  cleanup = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerover', over)
    document.documentElement.removeEventListener('pointerleave', leave)
    gsap.killTweensOf(el)
  }
})

onUnmounted(() => cleanup())
</script>

<template>
  <div
      v-if="enabled"
      ref="ring"
      class="pointer-events-none fixed left-0 top-0 z-[90] h-7 w-7 border border-accent opacity-0 transition-opacity duration-300"
      aria-hidden="true"
  ></div>
</template>