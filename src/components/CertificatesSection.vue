<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { content } from '../data/store'
import { useInView } from '../lib/useInView'

const { locale } = useI18n()
const { el, seen } = useInView()
const viewport = ref(null)
const track = ref(null)
const idx = ref(0)
const count = computed(() => content.certificates.length)
const pad = (n) => String(n).padStart(2, '0')

let x = 0
let step = 0
let max = 0
let dragging = false
let startX = 0
let startOffset = 0
let lastX = 0
let lastT = 0
let velocity = 0
let moved = 0
let blockUntil = 0
let visible = true
let timer
let ro
let io

const clampX = (v) => Math.max(-max, Math.min(0, v))

function measure() {
  if (!track.value || !viewport.value) return
  const cards = Array.from(track.value.children)
  if (!cards.length) return
  const cs = getComputedStyle(track.value)
  const gap = parseFloat(cs.columnGap || cs.gap) || 24
  const padL = parseFloat(cs.paddingLeft) || 0
  step = cards[0].offsetWidth + gap
  max = Math.max(0, cards.length * step - gap + padL * 2 - viewport.value.offsetWidth)
  x = clampX(x)
  gsap.set(track.value, { x })
}

function animateTo(target) {
  x = clampX(target)
  gsap.to(track.value, { x, duration: 0.7, ease: 'power4.out', overwrite: true })
}

function goTo(i, user = true) {
  idx.value = Math.max(0, Math.min(count.value - 1, i))
  animateTo(-idx.value * step)
  if (user) blockUntil = performance.now() + 2000
}

function onDown(e) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  dragging = true
  moved = 0
  startX = lastX = e.clientX
  startOffset = gsap.getProperty(track.value, 'x')
  lastT = performance.now()
  velocity = 0
  blockUntil = Infinity
  gsap.killTweensOf(track.value)
  track.value.setPointerCapture?.(e.pointerId)
}

function onMove(e) {
  if (!dragging) return
  const dx = e.clientX - startX
  moved = Math.max(moved, Math.abs(dx))
  let nx = startOffset + dx
  if (nx > 0) nx *= 0.35
  else if (nx < -max) nx = -max + (nx + max) * 0.35
  const now = performance.now()
  const dt = now - lastT
  if (dt > 0) velocity = (e.clientX - lastX) / dt
  lastX = e.clientX
  lastT = now
  gsap.set(track.value, { x: nx })
}

function onUp() {
  if (!dragging) return
  dragging = false
  const target = Math.min(0, gsap.getProperty(track.value, 'x') + velocity * 300)
  const i = Math.max(0, Math.min(count.value - 1, Math.round(Math.abs(target) / step)))
  idx.value = i
  animateTo(-i * step)
  blockUntil = performance.now() + 1500
}

function onClickCapture(e) {
  if (moved > 6) {
    e.preventDefault()
    e.stopPropagation()
  }
}

function remeasure() {
  nextTick(() => {
    measure()
    idx.value = Math.min(idx.value, Math.max(count.value - 1, 0))
  })
}

onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(viewport.value)
  io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(viewport.value)

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    timer = setInterval(() => {
      if (dragging || !visible || max === 0 || performance.now() < blockUntil) return
      goTo(idx.value + 1 >= count.value ? 0 : idx.value + 1, false)
    }, 4500)
  }
})

onUnmounted(() => {
  clearInterval(timer)
  ro?.disconnect()
  io?.disconnect()
  if (track.value) gsap.killTweensOf(track.value)
})

watch([count, locale], remeasure)
</script>

<template>
  <section id="certificates" ref="el" class="sec alt" style="overflow: hidden">
    <div class="wrap" style="margin-bottom: 56px">
      <div class="reveal sec-head" :class="{ 'in-view': seen }" style="margin-bottom: 0">
        <div>
          <div class="marker"><span>{{ $t('ce.marker') }}</span></div>
          <h2 class="display sec-title">
            <span>{{ $t('ce.t1') }}</span><br />
            <span class="accent">{{ $t('ce.t2') }}</span>
            <span class="stroke">{{ $t('ce.t3') }}</span>
          </h2>
        </div>
        <div>
          <p class="sec-text">{{ $t('ce.text') }}</p>
          <div
            class="mono upper"
            style="display: flex; gap: 12px; align-items: center; font-size: 10px; letter-spacing: 0.2em; color: var(--muted); margin-top: 20px"
          >
            <svg class="i accent"><use href="#i-hand" /></svg>
            <span>{{ $t('ce.hint') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div ref="viewport" class="carousel">
      <div
        ref="track"
        class="c-track"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
        @click.capture="onClickCapture"
        @mouseenter="blockUntil = Infinity"
        @mouseleave="blockUntil = performance.now() + 1000"
      >
        <article v-for="(c, i) in content.certificates" :key="c.id" class="c-card notch">
          <div class="c-img">
            <span class="ph">{{ pad(i + 1) }}</span>
            <img v-if="c.image" :src="c.image" :alt="c.title[locale]" loading="lazy" draggable="false" />
            <span class="tag idx" style="position: absolute; inset-inline-start: 14px; z-index: 3">
              CERT / {{ pad(i + 1) }}
            </span>
          </div>
          <div class="c-body">
            <div class="c-top"><h3 class="display">{{ c.title[locale] }}</h3></div>
            <div class="c-issuer">
              <svg class="i"><use href="#i-award" /></svg>
              <span>{{ c.issuer[locale] }}</span>
            </div>
            <div class="c-foot">
              <span v-if="c.year">{{ $t('ce.year') }} {{ c.year }}</span>
              <span v-else></span>
              <a v-if="c.link" :href="c.link" target="_blank" rel="noopener">
                {{ $t('ce.verify') }}
                <svg class="i"><use href="#i-ext" /></svg>
              </a>
            </div>
          </div>
        </article>
      </div>

      <div class="wrap c-ctrl">
        <div class="dots">
          <button
            v-for="(c, i) in content.certificates"
            :key="c.id"
            :class="{ on: i === idx }"
            :aria-label="'Slide ' + (i + 1)"
            @click="goTo(i)"
          ></button>
        </div>
        <div class="arrows">
          <button class="arr" aria-label="Previous" @click="goTo(idx - 1)">
            <svg class="i" style="transform: scaleX(-1)"><use href="#i-arrow" /></svg>
          </button>
          <button class="arr" aria-label="Next" @click="goTo(idx + 1)">
            <svg class="i"><use href="#i-arrow" /></svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>