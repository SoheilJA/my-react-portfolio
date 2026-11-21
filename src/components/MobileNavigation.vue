<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import LangSwitch from './LangSwitch.vue'

const props = defineProps({ open: Boolean, links: Array })
const emit = defineEmits(['close'])
const closeBtn = ref(null)
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches

watch(
  () => props.open,
  async (v) => {
    document.documentElement.style.overflow = v ? 'hidden' : ''
    if (v) {
      await nextTick()
      closeBtn.value?.focus()
    }
  }
)

function onKey(e) {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})

function enter(el, done) {
  if (reduce()) return done()
  gsap
    .timeline({ onComplete: done })
    .fromTo(
      el,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.inOut' }
    )
    .from(
      el.querySelectorAll('.m-item'),
      { y: 40, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' },
      0.25
    )
}

function leave(el, done) {
  if (reduce()) return done()
  gsap.to(el, {
    clipPath: 'inset(0 0 100% 0)',
    duration: 0.45,
    ease: 'power3.inOut',
    onComplete: done,
  })
}
</script>

<template>
  <Teleport to="body">
    <Transition :css="false" @enter="enter" @leave="leave">
      <div
        v-if="open"
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        class="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
      >
        <div
          class="hatch pointer-events-none absolute inset-y-0 start-0 w-3 border-e border-line"
          aria-hidden="true"
        ></div>

        <div class="flex h-14 items-center justify-between border-b border-line px-6">
          <span class="label text-accent">Menu</span>
          <button
            ref="closeBtn"
            class="grid h-9 w-9 place-items-center border border-line text-ink"
            aria-label="Close"
            @click="emit('close')"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <nav class="flex flex-1 flex-col justify-center px-6">
          <a
            v-for="(l, i) in links"
            :key="l.id"
            :href="'#' + l.id"
            class="m-item flex items-baseline gap-4 border-b border-line py-5 text-3xl font-bold text-ink first:border-t"
            @click="emit('close')"
          >
            <span class="label text-accent" dir="ltr">0{{ i + 1 }}</span>
            {{ $t(l.key) }}
          </a>
        </nav>

        <div class="m-item border-t border-line p-6">
          <LangSwitch class="w-fit" @click="emit('close')" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>