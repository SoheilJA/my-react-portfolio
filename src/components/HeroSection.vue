<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import HeroVisual from './HeroVisual.vue'

const root = ref(null)
let ctx

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ctx = gsap.context(() => {
    gsap
      .timeline({ delay: 0.2, defaults: { ease: 'power4.out' } })
      .from('.hero-line', { yPercent: 110, duration: 1, stagger: 0.12 })
      .from('.hero-fade', { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.4)
      .from('.hero-win', { y: 40, opacity: 0, duration: 0.9, stagger: 0.15 }, 0.7)
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="home" ref="root" class="relative -mx-6 border-b border-line">
    <div
      class="hero-fade flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-3 md:px-12 lg:ps-20"
    >
      <p class="label text-faint">{{ $t('hero.kicker') }}</p>
      <p class="flex items-center gap-2 text-sm text-ink">
        <span class="h-2 w-2 animate-pulse bg-accent"></span>
        {{ $t('hero.status') }}
      </p>
    </div>

    <div class="border-b border-line px-6 py-8 md:px-12 md:py-12 lg:ps-20">
      <h1
        class="text-[clamp(2.6rem,7.5vw,6.25rem)] font-bold leading-[1.3] text-ink ltr:leading-[1.05] ltr:tracking-tighter"
      >
        <span class="block overflow-hidden pb-2">
          <span class="hero-line block">{{ $t('hero.line1') }}</span>
        </span>
        <span class="block overflow-hidden pb-2">
          <span class="hero-line block">{{ $t('hero.line2') }}</span>
        </span>
        <span class="block overflow-hidden pb-2">
          <span class="hero-line block text-accent">{{ $t('hero.line3') }}</span>
        </span>
      </h1>
    </div>

    <div class="hero-fade border-b border-line px-6 py-5 md:px-12 lg:ps-20">
      <p class="max-w-2xl text-lg leading-8">{{ $t('hero.subtitle') }}</p>
    </div>

    <div
      class="hero-fade flex flex-wrap items-center gap-4 border-b border-line px-6 py-6 md:px-12 lg:ps-20"
    >
      <a
        v-magnetic
        href="#works"
        class="bg-accent px-6 py-3 font-bold text-bg transition hover:bg-accent2"
      >
        {{ $t('hero.cta2') }}
      </a>
      <a
        v-magnetic
        href="#contact"
        class="border border-line2 px-6 py-3 text-ink transition hover:border-accent"
      >
        {{ $t('hero.cta') }}
      </a>
    </div>

    <HeroVisual />
  </section>
</template>