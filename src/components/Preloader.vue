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

const root = ref(null)
const phase = ref('loading')
const pct = ref(0)
const tc = ref('00:00:00:00')
const audioOn = ref(false)
const halves = ['top', 'bot']

const statusLines = ['INIT · FONTS', 'LOAD · ASSETS', 'COMPILE · MOTION', 'SYSTEM · READY']
const status = computed(() =>
  phase.value === 'loading'
    ? statusLines[Math.min(2, Math.floor(pct.value / 34))]
    : statusLines[3]
)
const pad3 = computed(() => String(pct.value).padStart(3, '0'))

const q = gsap.utils.selector(root)
const state = { v: 0 }
const gestures = ['pointerdown', 'keydown', 'touchstart']
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
  tl.to(q('.pl-bar'), { height: '11vh', duration: 1.2, ease: 'power3.inOut' }, 0)
    .to(q('.pl-hud'), { opacity: 0, duration: 0.5 }, 0.2)
    .to(q('.pl-name'), { scale: 1.06, duration: 1.8, ease: 'power1.in' }, 0)
    .to(
      q('.pl-name'),
      {
        x: 'random(-3, 3)',
        y: 'random(-2, 2)',
        duration: 0.05,
        repeat: 26,
        yoyo: true,
        repeatRefresh: true,
        ease: 'none',
      },
      0.2
    )
    .set(q('.pl-name'), { x: 0, y: 0 }, 1.55)
    .call(thump, null, 1.6)
    .fromTo(q('.pl-flash'), { opacity: 0.35 }, { opacity: 0, duration: 0.8, ease: 'power2.out' }, 1.6)
    .to(
      root.value,
      {
        x: 'random(-8, 8)',
        y: 'random(-5, 5)',
        duration: 0.045,
        repeat: 7,
        yoyo: true,
        repeatRefresh: true,
        ease: 'none',
      },
      1.6
    )
    .set(root.value, { x: 0, y: 0 }, 2)
    .call(
      () => {
        whoosh(1.4)
        emit('leaving')
      },
      null,
      1.9
    )
    .to(q('.pl-seam'), { opacity: 0, duration: 0.2 }, 1.9)
    .to(q('.pl-bar'), { height: 0, duration: 0.7, ease: 'power3.in' }, 1.9)
    .to(q('.pl-top'), { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, 1.9)
    .to(q('.pl-bot'), { yPercent: 100, duration: 1.2, ease: 'power4.inOut' }, 1.9)
}

onMounted(async () => {
  startTimecode()
  gsap.from(q('.pl-name'), { opacity: 0, y: 24, duration: 1.1, ease: 'power3.out' })
  gsap.fromTo(q('.pl-seam'), { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power3.inOut' })
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
  await wait(250)
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
    class="fixed inset-0 z-[300] overflow-hidden text-ink"
    role="dialog"
    aria-modal="true"
    aria-label="Intro"
  >
    <div
      v-for="half in halves"
      :key="half"
      class="absolute inset-x-0 h-1/2 overflow-hidden bg-[#050505]"
      :class="half === 'top' ? 'pl-top top-0' : 'pl-bot bottom-0'"
    >
      <div
        class="absolute inset-x-0 flex h-[200%] items-center justify-center"
        :class="half === 'top' ? 'top-0' : 'bottom-0'"
      >
        <div class="absolute inset-0 [background:radial-gradient(ellipse_at_50%_50%,rgba(255,84,0,.16),transparent_60%)]"></div>
        <div class="absolute inset-0 [background:repeating-linear-gradient(0deg,transparent_0_3px,rgba(0,0,0,.18)_3px_4px)]"></div>
        <div class="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]"></div>

        <div
          class="pl-name relative whitespace-nowrap font-display text-[clamp(52px,13.5vw,220px)] leading-none"
          dir="ltr"
          aria-hidden="true"
        >
          <span class="text-transparent [-webkit-text-stroke:1.5px_#5a5a5a]">SOHEIL AHMADI</span>
          <span class="absolute inset-0 text-accent [text-shadow:0_0_40px_rgba(255,84,0,.45)] [clip-path:inset(calc(100%_-_var(--p,0)_*_100%)_0_0_0)]">SOHEIL AHMADI</span>
        </div>

        <div
          class="pl-bar absolute inset-x-0 z-[3] h-0 bg-black"
          :class="half === 'top' ? 'top-0' : 'bottom-0'"
        ></div>
      </div>
    </div>

    <div class="pl-seam absolute inset-x-0 top-1/2 z-[5] h-px bg-accent shadow-[0_0_16px_rgba(255,84,0,.8)]"></div>

    <div
      class="pl-hud pointer-events-none absolute inset-0 z-[6] font-mono text-[11px] uppercase tracking-[.2em] text-muted"
      dir="ltr"
    >
      <div class="absolute left-8 top-7 max-sm:hidden">SOHEIL JALAL AHMADI — PORTFOLIO 2026</div>
      <div class="absolute right-8 top-7 flex items-center gap-2.5 tabular-nums max-sm:left-5 max-sm:right-auto max-sm:top-5">
        <span class="h-2 w-2 animate-pulse rounded-full bg-accent"></span>{{ tc }}
      </div>
      <div class="absolute bottom-6 left-8 flex items-end gap-1.5 max-sm:bottom-5 max-sm:left-5">
        <span class="font-display text-[clamp(64px,12vw,160px)] leading-[.85] tracking-normal text-ink">{{ pad3 }}</span>
        <span class="font-display text-[clamp(28px,4vw,56px)] leading-none text-accent">%</span>
      </div>
      <div class="absolute bottom-8 right-8 text-accent max-sm:bottom-6 max-sm:right-5 max-sm:text-[9px]" aria-live="polite">{{ status }}</div>
      <span class="absolute left-3.5 top-3.5 h-[18px] w-[18px] border-l border-t border-faint"></span>
      <span class="absolute right-3.5 top-3.5 h-[18px] w-[18px] border-r border-t border-faint"></span>
      <span class="absolute bottom-3.5 left-3.5 h-[18px] w-[18px] border-b border-l border-faint"></span>
      <span class="absolute bottom-3.5 right-3.5 h-[18px] w-[18px] border-b border-r border-faint"></span>
    </div>

    <button
      v-if="soundSupported && !audioOn"
      class="absolute inset-x-0 bottom-28 z-[7] mx-auto w-fit cursor-pointer font-mono text-[11px] uppercase tracking-[.2em] text-dim transition-colors hover:text-accent"
      @click="unlock"
    >
      ♪ {{ $t('pl.tap') }}
    </button>

    <div class="pl-flash pointer-events-none absolute inset-0 z-[8] bg-accent opacity-0 mix-blend-screen"></div>
  </div>
</template>