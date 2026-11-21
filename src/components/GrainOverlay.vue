<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const el = ref(null)
let tick
let off

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let target = 0
  let current = 0
  const onScroll = () => (target = window.scrollY * 0.15)
  tick = () => {
    current += (target - current) * 0.08
    if (el.value) el.value.style.transform = `translateY(${current}px)`
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  gsap.ticker.add(tick)
  off = () => window.removeEventListener('scroll', onScroll)
})

onUnmounted(() => {
  if (tick) gsap.ticker.remove(tick)
  off?.()
})
</script>

<template>
  <div ref="el" class="grain" aria-hidden="true"></div>
</template>