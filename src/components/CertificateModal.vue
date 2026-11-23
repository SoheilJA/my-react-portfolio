<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'

const props = defineProps({ certificate: Object })
const emit = defineEmits(['close'])
const { locale } = useI18n()

function onEsc(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onEsc))
onUnmounted(() => window.removeEventListener('keydown', onEsc))

let prevOverflow = ''
watch(
  () => props.certificate,
  (c) => {
    if (c) {
      prevOverflow = document.body.style.overflow
      document.documentElement.classList.add('modal-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.classList.remove('modal-open')
      document.body.style.overflow = prevOverflow
    }
  }
)

onUnmounted(() => {
  document.documentElement.classList.remove('modal-open')
  document.body.style.overflow = prevOverflow
})

function enter(el, done) {
  gsap.from(el, { opacity: 0, duration: 0.3 })
  gsap.from(el.querySelector('.panel'), {
    y: 60,
    scale: 0.95,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.out',
    onComplete: done,
  })
}

function leave(el, done) {
  gsap.to(el, { opacity: 0, duration: 0.25, onComplete: done })
}
</script>

<template>
  <Teleport to="body">
    <Transition :css="false" @enter="enter" @leave="leave">
      <div
        v-if="certificate"
        data-lenis-prevent
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        @click.self="emit('close')"
      >
        <div
          data-lenis-prevent
          class="panel relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border border-line bg-surface"
        >
          <div class="relative shrink-0">
            <img
              v-if="certificate.image"
              :src="certificate.image"
              :alt="certificate.title[locale]"
              class="aspect-video w-full object-cover"
            />
            <div
              v-else
              class="bg-grid flex aspect-video items-center justify-center font-display text-6xl font-bold text-outline"
            >
              {{ certificate.title.en.slice(0, 2) }}
            </div>

            <button
              class="absolute top-3 z-10 flex h-11 w-11 items-center justify-center border border-line bg-black/70 text-lg text-ink transition hover:border-accent hover:text-accent"
              style="inset-inline-end: 12px"
              aria-label="Close"
              @click="emit('close')"
            >
              ✕
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8" data-lenis-prevent>
            <span
              class="label mb-4 border border-accent-dim px-2.5 py-1 text-accent"
              style="display: inline-block"
            >
              CERT
            </span>

            <h3 class="font-display text-2xl font-bold leading-[1.3] text-ink sm:text-3xl">
              {{ certificate.title[locale] }}
            </h3>

            <div class="mt-3 flex items-center gap-2 text-dim">
              <svg class="i accent"><use href="#i-award" /></svg>
              <span>{{ certificate.issuer[locale] }}</span>
            </div>

            <div v-if="certificate.year" class="mt-5">
              <div class="label mb-2 text-muted">{{ $t('ce.year') }}</div>
              <p class="font-mono text-lg text-ink">{{ certificate.year }}</p>
            </div>
          </div>

          <div
            class="flex shrink-0 flex-col gap-3 border-t border-line bg-surface p-4 sm:flex-row sm:p-5"
            data-lenis-prevent
          >
            <a
              v-if="certificate.link"
              :href="certificate.link"
              target="_blank"
              rel="noopener"
              class="flex flex-1 items-center justify-center gap-2 bg-accent px-5 py-3 font-bold text-bg transition hover:bg-ink"
            >
              {{ $t('ce.verify') }}
              <svg class="i h-4 w-4"><use href="#i-ext" /></svg>
            </a>
            <button
              class="border border-line px-5 py-3 text-ink transition hover:border-accent"
              :class="certificate.link ? 'sm:flex-none' : 'flex-1'"
              @click="emit('close')"
            >
              {{ $t('works.close') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>