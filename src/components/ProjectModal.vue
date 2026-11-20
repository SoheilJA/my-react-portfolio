<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'

defineProps({ project: Object })
const emit = defineEmits(['close'])
const { locale } = useI18n()

function onEsc(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onEsc))
onUnmounted(() => window.removeEventListener('keydown', onEsc))

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
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          @click.self="emit('close')"
      >
        <div
            data-lenis-prevent
            class="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-line bg-surface"
        >
          <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title[locale]"
              class="w-full object-cover"
          />
          <div
              v-else
              class="bg-grid flex aspect-video items-center justify-center font-display text-6xl font-bold text-outline"
          >
            {{ project.title.en.slice(0, 2) }}
          </div>

          <div class="p-6">
            <h3 class="font-display text-3xl font-bold leading-[1.3] text-ink">
              {{ project.title[locale] }}
            </h3>
            <p v-if="project.desc[locale]" class="mt-4 leading-7">
              {{ project.desc[locale] }}
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                  v-for="t in project.tech"
                  :key="t"
                  class="label border border-line px-2 py-1"
              >
                {{ t }}
              </span>
            </div>

            <div class="mt-6 flex gap-4">
              <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  rel="noopener"
                  class="bg-accent px-5 py-2.5 font-bold text-bg transition hover:bg-ink"
              >
                {{ $t('works.visit') }}
              </a>
              <button
                  class="border border-line px-5 py-2.5 text-ink transition hover:border-accent"
                  @click="emit('close')"
              >
                {{ $t('works.close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>