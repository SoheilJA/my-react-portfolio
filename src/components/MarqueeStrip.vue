<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps({
  items: { type: Array, required: true },
  direction: { type: Number, default: 1 },
  size: { type: String, default: 'lg' },
  duration: { type: Number, default: 40 },
})

const track = ref(null)
const loop = computed(() => [...props.items, ...props.items])
let tween
let trigger

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const forward = props.direction > 0
  tween = gsap.fromTo(
      track.value,
      { xPercent: forward ? 0 : -50 },
      {
        xPercent: forward ? -50 : 0,
        duration: props.duration,
        ease: 'none',
        repeat: -1,
      }
  )

  trigger = ScrollTrigger.create({
    trigger: track.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate(self) {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 6)
      tween.timeScale(boost)
      gsap.to(tween, { timeScale: 1, duration: 1, overwrite: true })
    },
    onToggle(self) {
      self.isActive ? tween.resume() : tween.pause()
    },
  })
})

onUnmounted(() => {
  trigger?.kill()
  tween?.kill()
})
</script>

<template>
  <div
      dir="ltr"
      class="overflow-hidden whitespace-nowrap"
      aria-hidden="true"
      @mouseenter="tween?.timeScale(0.25)"
      @mouseleave="tween?.timeScale(1)"
  >
    <div ref="track" class="flex w-max">
      <div v-for="n in 2" :key="n" class="flex shrink-0 items-center">
        <span v-for="(w, i) in loop" :key="i" class="flex items-center">
          <span
              class="px-6 font-display font-bold"
              :class="
              size === 'lg'
                ? ['text-[clamp(3rem,9vw,8rem)] leading-none', i % 2 ? 'text-outline' : 'text-ink']
                : 'font-mono text-lg font-normal text-muted'
            "
          >
            {{ w }}
          </span>
          <span class="text-accent" :class="size === 'lg' ? 'text-4xl' : 'text-lg'">✦</span>
        </span>
      </div>
    </div>
  </div>
</template>