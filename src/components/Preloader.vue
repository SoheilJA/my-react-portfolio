<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { content } from '../data/store'
import {
  soundSupported,
  unlockAudio,
  blip,
  tick,
  riser,
  impact,
  whoosh,
  fadeOutAndClose,
} from '../lib/sound'

const emit = defineEmits(['leaving', 'done'])

const root = ref(null)
const primary = ref(null)
const silent = ref(null)
const phase = ref('loading')
const pct = ref(0)
const tc = ref('00:00:00:00')

const statusLines = ['INIT · FONTS', 'LOAD · ASSETS', 'COMPILE · MOTION', 'SYSTEM · READY']
const status = computed(() =>
  phase.value !== 'loading'
    ? statusLines[3]
    : statusLines[Math.min(2, Math.floor(pct.value / 34))]
)
const pad3 = computed(() => String(pct.value).padStart(3, '0'))

const q = gsap.utils.selector(root)
const state = { v: 0 }
let dead = false
let tl
let tcTick

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const tween = (target, vars) =>
  new Promise((res) => gsap.to(target, { ...vars, onComplete: res }))
const p2 = (n) => String(n).padStart(2, '0')

function render() {
  pct.value = Math.round(state.v)
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

function finish(audio) {
  if (audio) fadeOutAndClose(2.4)
  emit('done')
}

async function enter(withSound) {
  if (phase.value !== 'ready') return
  phase.value = 'playing'

  let audio = false
  if (withSound && soundSupported) {
    try {
      audio = await unlockAudio()
    } catch {
      audio = false
    }
  }
  if (audio) blip()

  tl = gsap.timeline()
  tl.to(q('.pl-gate, .pl-hud'), { opacity: 0, duration: 0.4 }, 0)
    .to(q('.pl-bar'), { height: '11vh', duration: 1.4, ease: 'power3.inOut' }, 0.1)
    .to(q('.pl-name'), { scale: 1.05, duration: 2.2, ease: 'power1.in' }, 0)
    .to(
      q('.pl-name'),
      {
        x: 'random(-4, 4)',
        y: 'random(-3, 3)',
        duration: 0.05,
        repeat: 34,
        yoyo: true,
        repeatRefresh: true,
        ease: 'none',
      },
      0.3
    )
    .set(q('.pl-name'), { x: 0, y: 0 }, 2.15)
    .call(() => audio && impact(), null, 2.2)
    .fromTo(q('.pl-flash'), { opacity: 0.4 }, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 2.2)
    .to(
      root.value,
      {
        x: 'random(-9, 9)',
        y: 'random(-6, 6)',
        duration: 0.045,
        repeat: 9,
        yoyo: true,
        repeatRefresh: true,
        ease: 'none',
      },
      2.2
    )
    .set(root.value, { x: 0, y: 0 }, 2.7)
    .call(
      () => {
        if (audio) whoosh(1.2)
        emit('leaving')
      },
      null,
      2.55
    )
    .to(q('.pl-seam'), { opacity: 0, duration: 0.2 }, 2.55)
    .to(q('.pl-bar'), { height: 0, duration: 0.7, ease: 'power3.in' }, 2.55)
    .to(q('.pl-top'), { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, 2.55)
    .to(q('.pl-bot'), { yPercent: 100, duration: 1.2, ease: 'power4.inOut' }, 2.55)
    .call(finish, [audio], 3.9)

  if (audio) {
    riser(2.2)
    ;[0.15, 0.55, 0.9, 1.2, 1.45, 1.65, 1.8, 1.92, 2.02, 2.1].forEach((t, i) => {
      gsap.delayedCall(t, () => tick(1300 + i * 140))
    })
  }
}

onMounted(async () => {
  startTimecode()
  gsap.from(q('.pl-name'), { opacity: 0, y: 24, duration: 1.1, ease: 'power3.out' })
  gsap.to(q('.pl-seam'), { scaleX: 1, duration: 1.3, ease: 'power3.inOut' })
  gsap.from(q('.pl-hud > *'), { opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.3 })

  const imgs = content.projects
    .filter((p) => p.image)
    .slice(0, 5)
    .map((p) => p.image)
  let loaded = false
  Promise.race([
    Promise.allSettled([document.fonts?.ready, ...imgs.map(loadImage)]),
    wait(7000),
  ]).then(() => (loaded = true))

  await tween(state, { v: 85, duration: 2.4, ease: 'power2.inOut', onUpdate: render })
  while (!loaded && !dead) await wait(80)
  if (dead) return
  await tween(state, { v: 100, duration: 0.7, ease: 'power2.out', onUpdate: render })
  if (dead) return

  phase.value = 'ready'
  await nextTick()
  gsap.from(q('.pl-gate > *'), { y: 24, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' })
  ;(primary.value || silent.value)?.focus()
})

onUnmounted(() => {
  dead = true
  tl?.kill()
  if (tcTick) gsap.ticker.remove(tcTick)
  gsap.killTweensOf(state)
})
</script>

<template>
  <div ref="root" class="pl" role="dialog" aria-modal="true" aria-label="Intro">
    <div
      v-for="half in ['top', 'bot']"
      :key="half"
      class="pl-half"
      :class="'pl-' + half"
    >
      <div class="pl-stage">
        <div class="pl-bg"></div>
        <div class="pl-grid"></div>
        <div class="pl-name" aria-hidden="true">
          <span class="o">SOHEIL AHMADI</span>
          <span class="f">SOHEIL AHMADI</span>
        </div>
        <div class="pl-bar" :class="'pl-bar-' + half"></div>
      </div>
    </div>

    <div class="pl-seam"></div>

    <div class="pl-hud" dir="ltr">
      <div class="pl-tl">SOHEIL JALAL AHMADI — PORTFOLIO 2026</div>
      <div class="pl-tr"><span class="pl-rec"></span>{{ tc }}</div>
      <div class="pl-bl">
        <span class="pl-count">{{ pad3 }}</span><span class="pl-pct">%</span>
      </div>
      <div class="pl-br" aria-live="polite">{{ status }}</div>
      <span class="pl-corner c1"></span>
      <span class="pl-corner c2"></span>
      <span class="pl-corner c3"></span>
      <span class="pl-corner c4"></span>
    </div>

    <div v-if="phase !== 'loading'" class="pl-gate">
      <div class="pl-ready">{{ $t('pl.ready') }}</div>
      <div class="pl-btns">
        <button
          v-if="soundSupported"
          ref="primary"
          class="pl-btn primary pulse"
          @click="enter(true)"
        >
          <svg class="i"><use href="#i-play" /></svg>
          {{ $t('pl.enter_sound') }}
        </button>
        <button ref="silent" class="pl-btn" @click="enter(false)">
          {{ $t('pl.enter_silent') }}
        </button>
      </div>
      <div v-if="soundSupported" class="pl-hint">{{ $t('pl.hint') }}</div>
    </div>

    <div class="pl-flash"></div>
    <div class="grain" aria-hidden="true"></div>
  </div>
</template>