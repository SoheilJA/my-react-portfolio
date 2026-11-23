<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { content } from '../data/store'
import {
  soundSupported,
  prepareAudio,
  onAudioRunning,
  unlockAudio,
  startAmbience,
  setTune,
  thump,
  whoosh,
  endAmbience,
} from '../lib/sound'

const emit = defineEmits(['leaving', 'done'])

const SEGMENTS = 48
const segments = Array.from({ length: SEGMENTS }, (_, i) => i)
const statusLines = ['INIT · FONTS', 'LOAD · ASSETS', 'COMPILE · MOTION', 'SYSTEM · READY']
const gestures = ['pointerdown', 'keydown', 'touchstart']

const root = ref(null)
const phase = ref('loading')
const pct = ref(0)
const tc = ref('00:00:00:00')
const audioOn = ref(false)

const filled = computed(() => Math.round((pct.value / 100) * SEGMENTS))
const pad3 = computed(() => String(pct.value).padStart(3, '0'))
const status = computed(() =>
  phase.value === 'loading'
    ? statusLines[Math.min(2, Math.floor(pct.value / 34))]
    : statusLines[3],
)

let q
const state = { v: 0 }
let dead = false
let tl
let tcTick

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const p2 = (n) => String(n).padStart(2, '0')
const tween = (target, vars) =>
  new Promise((res) => gsap.to(target, { ...vars, onComplete: res }))

function unlock() {
  unlockAudio()
}

function render() {
  const r = Math.round(state.v)
  if (r !== pct.value) {
    pct.value = r
    setTune(r / 100)
  }
  root.value?.style.setProperty('--p', String(state.v / 100))
}

function startTimecode() {
  const t0 = performance.now()
  tcTick = () => {
    const ms = performance.now() - t0
    const f = Math.floor((ms / 1000) * 24) % 24
    const s = Math.floor(ms / 1000) % 60
    const m = Math.floor(ms / 60000) % 60
    tc.value = `00:${p2(m)}:${p2(s)}:${p2(f)}`
  }
  gsap.ticker.add(tcTick)
}

function loadImage(src) {
  return new Promise((res) => {
    const i = new Image()
    i.onload = i.onerror = res
    i.src = src
  })
}

function finish() {
  endAmbience(2.2)
  emit('done')
}

function play() {
  phase.value = 'playing'
  tl = gsap.timeline({ onComplete: finish })
  tl.to(q('.pl-name'), { scale: 1.045, duration: 1.1, ease: 'power1.in' }, 0)
    .to(
      q('.pl-name'),
      {
        x: 'random(-3, 3)',
        y: 'random(-2, 2)',
        duration: 0.05,
        repeat: 18,
        yoyo: true,
        repeatRefresh: true,
        ease: 'none',
      },
      0.1,
    )
    .set(q('.pl-name'), { x: 0, y: 0 }, 1)
    .call(thump, null, 0.85)
    .fromTo(
      q('.pl-flash'),
      { opacity: 0 },
      { opacity: 0.5, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' },
      0.85,
    )
    .to(
      q('.pl-kicker, .pl-meta, .pl-hud'),
      { opacity: 0, y: -10, duration: 0.4, ease: 'power2.in' },
      0.9,
    )
    .call(
      () => {
        whoosh(1.4)
        emit('leaving')
      },
      null,
      1.15,
    )
    .to(root.value, { yPercent: -100, duration: 1.05, ease: 'power4.inOut' }, 1.15)
}

onMounted(async () => {
  q = gsap.utils.selector(root.value)
  startTimecode()
  gsap.from(q('.pl-kicker'), { opacity: 0, y: 10, duration: 0.8, ease: 'power3.out' })
  gsap.from(q('.pl-name'), { opacity: 0, y: 26, duration: 1.1, ease: 'power3.out', delay: 0.1 })
  gsap.from(q('.pl-meter'), { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out', delay: 0.35 })
  gsap.from(q('.pl-meta'), { opacity: 0, duration: 0.8, delay: 0.5 })
  gsap.from(q('.pl-hud > *'), { opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.3 })

  if (soundSupported) {
    prepareAudio()
    onAudioRunning(() => {
      audioOn.value = true
      startAmbience()
      setTune(state.v / 100)
    })
    gestures.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }))
  }

  const imgs = content.projects
    .filter((p) => p.image)
    .slice(0, 5)
    .map((p) => p.image)
  let loaded = false
  Promise.race([
    Promise.allSettled([document.fonts?.ready, ...imgs.map(loadImage)]),
    wait(7000),
  ]).then(() => (loaded = true))

  await tween(state, { v: 85, duration: 2, ease: 'power2.inOut', onUpdate: render })
  while (!loaded && !dead) await wait(80)
  if (dead) return
  await tween(state, { v: 100, duration: 0.6, ease: 'power2.out', onUpdate: render })
  if (dead) return
  await wait(280)
  if (!dead) play()
})

onUnmounted(() => {
  dead = true
  tl?.kill()
  if (tcTick) gsap.ticker.remove(tcTick)
  gsap.killTweensOf(state)
  gestures.forEach((ev) => window.removeEventListener(ev, unlock))
  endAmbience(0.3)
})
</script>

<template>
  <div
    ref="root"
    class="fixed inset-0 z-[300] overflow-hidden bg-[#050505] text-ink"
    role="dialog"
    aria-modal="true"
    aria-label="Intro"
  >
    <!-- پس‌زمینه -->
    <div class="absolute inset-0 [background:radial-gradient(ellipse_at_50%_38%,rgba(255,84,0,.14),transparent_60%)]"></div>
    <div class="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000_25%,transparent_75%)]"></div>
    <div class="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(0deg,transparent_0_3px,rgba(0,0,0,.18)_3px_4px)]"></div>
    <div class="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,.75))]"></div>

    <!-- گوشه‌ها -->
    <div class="pl-hud pointer-events-none absolute inset-0 z-[6] font-mono text-[11px] uppercase tracking-[.2em] text-muted" dir="ltr">
      <div class="absolute left-8 top-7 max-sm:hidden">SOHEIL JALAL AHMADI — PORTFOLIO 2026</div>
      <div class="absolute right-8 top-7 flex items-center gap-2.5 tabular-nums max-sm:left-5 max-sm:right-auto max-sm:top-5">
        <span class="h-2 w-2 animate-pulse rounded-full bg-accent"></span>{{ tc }}
      </div>
      <span class="absolute left-3.5 top-3.5 h-[18px] w-[18px] border-l border-t border-faint"></span>
      <span class="absolute right-3.5 top-3.5 h-[18px] w-[18px] border-r border-t border-faint"></span>
      <span class="absolute bottom-3.5 left-3.5 h-[18px] w-[18px] border-b border-l border-faint"></span>
      <span class="absolute bottom-3.5 right-3.5 h-[18px] w-[18px] border-b border-r border-faint"></span>
    </div>

    <!-- مرکز -->
    <div class="absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 text-center">
      <div class="pl-kicker mb-6 font-mono text-[11px] uppercase tracking-[.35em] text-accent/80" dir="ltr">
        LOADING PORTFOLIO
      </div>

      <div
        class="pl-name relative select-none whitespace-nowrap font-display leading-[.85] tracking-normal text-[clamp(46px,13vw,200px)]"
        dir="ltr"
        aria-hidden="true"
      >
        <span class="text-transparent [-webkit-text-stroke:1.5px_#3a3a3a]">SOHEIL AHMADI</span>
        <span class="absolute inset-0 text-accent [clip-path:inset(0_calc(100%_-_var(--p,0)*100%)_0_0)] [text-shadow:0_0_50px_rgba(255,84,0,.5)]">SOHEIL AHMADI</span>
      </div>

      <div class="pl-meter mt-10 w-[min(560px,82vw)]" dir="ltr">
        <div class="flex gap-[3px]">
          <span
            v-for="i in segments"
            :key="i"
            class="h-3 flex-1 transition-colors duration-150"
            :class="
              i < filled
                ? 'bg-accent shadow-[0_0_8px_rgba(255,84,0,.6)]'
                : 'bg-white/10'
            "
          ></span>
        </div>

        <div class="pl-meta mt-5 flex items-end justify-between">
          <div class="flex items-end gap-1.5">
            <span class="font-display text-[clamp(44px,6vw,64px)] leading-[.8] tabular-nums text-ink">{{ pad3 }}</span>
            <span class="font-display text-[clamp(20px,3vw,32px)] leading-none text-accent">%</span>
          </div>
          <div class="pb-1 text-accent" aria-live="polite">{{ status }}</div>
        </div>
      </div>
    </div>

    <button
      v-if="soundSupported && !audioOn"
      class="absolute inset-x-0 bottom-24 z-[7] mx-auto w-fit cursor-pointer font-mono text-[11px] uppercase tracking-[.2em] text-dim transition-colors hover:text-accent"
      @click="unlock"
    >
      ♪ {{ $t('pl.tap') }}
    </button>

    <div class="pl-flash pointer-events-none absolute inset-0 z-[8] bg-accent opacity-0 mix-blend-screen"></div>
  </div>
</template>