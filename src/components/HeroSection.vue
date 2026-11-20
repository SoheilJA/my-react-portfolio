<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import gsap from 'gsap'
import HeroArt from './HeroArt.vue'
import {useI18n} from 'vue-i18n'

const {locale} = useI18n()

const root = ref(null)
let ctx

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ctx = gsap.context(() => {
    gsap
        .timeline({delay: 0.3, defaults: {ease: 'power4.out'}})
        .from('.hero-art', {scale: 0.85, opacity: 0, duration: 1.4})
        .from('.hero-line', {yPercent: 110, duration: 1.1, stagger: 0.12}, 0)
        .from('.hero-fade', {y: 24, opacity: 0, duration: 0.8, stagger: 0.1}, 0.6)
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section
      id="home"
      ref="root"
      class="relative isolate flex min-h-[calc(100svh-6rem)] items-center py-16"
  >
    <div class="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2">
      <div class="bg-grid fade-mask absolute inset-0"></div>
      <div class="bg-glow absolute inset-0"></div>
    </div>

    <div class="grid w-full items-center gap-8 lg:grid-cols-12">
      <div class="relative z-10 lg:col-span-8">
        <p class="hero-fade label text-accent">{{ $t('hero.kicker') }}</p>

        <h1
            class="mt-6 font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-bold leading-[1.15] tracking-tight text-ink"
        >
          <span class="block overflow-hidden">
            <span class="hero-line block">{{ $t('hero.line1') }}</span>
          </span>
          <span class="block overflow-hidden">
            <span class="hero-line block">{{ $t('hero.line2') }}</span>
          </span>
          <span class="block overflow-hidden">
            <span class="hero-line block text-accent">{{ $t('hero.line3') }}</span>
          </span>
        </h1>

        <p class="hero-fade mt-8 max-w-xl text-lg leading-8">
          {{ $t('hero.subtitle') }}
        </p>

        <div class="hero-fade mt-10 flex flex-wrap items-center gap-4">
          <a v-magnetic
              href="#contact"
              class="bg-accent px-6 py-3 font-bold text-bg transition hover:bg-ink"
          >
            {{ $t('hero.cta') }}
          </a>
          <a
              v-magnetic
              href="#works"
              class="border border-line px-6 py-3 text-ink transition hover:border-accent"
          >
            {{ $t('hero.cta2') }}
          </a>
        </div>

        <p class="hero-fade mt-8 flex items-center gap-3 text-ink">
          <span class="h-2.5 w-2.5 animate-pulse bg-accent"></span>
          {{ $t('hero.status') }}
        </p>
      </div>

      <div
          class="hero-art pointer-events-none absolute -end-24 top-10 w-80 text-ink opacity-40 lg:pointer-events-auto lg:static lg:col-span-4 lg:w-auto lg:opacity-100"
      >
        <HeroArt/>
      </div>
    </div>

    <div class="label absolute bottom-6 start-0 hidden gap-6 md:flex">
      <span dir="ltr">36.30° N / 59.60° E</span>
      <span>{{ locale === 'fa' ? 'مشهد' : 'Mashhad' }}</span>
    </div>
    <div class="label absolute bottom-6 end-0 hidden md:block">
      {{ $t('hero.scroll') }} ↓
    </div>
  </section>
</template>