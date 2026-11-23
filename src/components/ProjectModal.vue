<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'

const props = defineProps({ project: Object })
const emit = defineEmits(['close'])
const { locale } = useI18n()

function onEsc(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onEsc))
onUnmounted(() => window.removeEventListener('keydown', onEsc))

let prevOverflow = ''
watch(
    () => props.project,
    (p) => {
      if (p) {
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
          v-if="project"
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
                v-if="project.image"
                :src="project.image"
                :alt="project.title[locale]"
                class="aspect-video w-full object-cover"
            />
            <div
                v-else
                class="bg-grid flex aspect-video items-center justify-center font-display text-6xl font-bold text-outline"
            >
              {{ project.title.en.slice(0, 2) }}
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
                class="tag type mb-4"
                :class="{ wp: project.category === 'wordpress' }"
                style="position: static; display: inline-block"
            >
              {{ project.category === 'code' ? $t('works.tab_code') : $t('works.tab_wp') }}
            </span>

            <h3 class="font-display text-2xl font-bold leading-[1.3] text-ink sm:text-3xl">
              {{ project.title[locale] }}
            </h3>

            <p v-if="project.desc[locale]" class="mt-3 leading-7 text-dim">
              {{ project.desc[locale] }}
            </p>

            <div v-if="project.tech && project.tech.length" class="mt-6">
              <div class="label mb-3 text-muted">{{ $t('pj.stack') }}</div>
              <div class="flex flex-wrap gap-2">
                <span
                    v-for="t in project.tech"
                    :key="t"
                    class="label border border-line px-2.5 py-1 text-dim"
                >
                  {{ t }}
                </span>
              </div>
            </div>
          </div>

          <div
              class="flex shrink-0 flex-col gap-3 border-t border-line bg-surface p-4 sm:flex-row sm:p-5"
              data-lenis-prevent
          >
            <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                rel="noopener"
                class="flex flex-1 items-center justify-center gap-2 bg-accent px-5 py-3 font-bold text-bg transition hover:bg-ink"
            >
              {{ $t('works.view') }}
              <svg class="i h-4 w-4"><use href="#i-ext" /></svg>
            </a>
            <button
                class="border border-line px-5 py-3 text-ink transition hover:border-accent"
                :class="project.link ? 'sm:flex-none' : 'flex-1'"
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