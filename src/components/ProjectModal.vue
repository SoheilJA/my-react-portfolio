<script setup>
import {onMounted, onUnmounted} from 'vue'
import {useI18n} from 'vue-i18n'
import gsap from 'gsap'

defineProps({project: Object})
const emit = defineEmits(['close'])
const {locale} = useI18n()

function onEsc(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onEsc))
onUnmounted(() => window.removeEventListener('keydown', onEsc))

function enter(el, done) {
  gsap.from(el, {opacity: 0, duration: 0.3})
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
  gsap.to(el, {opacity: 0, duration: 0.25, onComplete: done})
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
        <div data-lenis-prevent class="panel max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-accent bg-bg">
          <img v-if="project.image" :src="project.image" class="w-full object-cover"/>
          <div
              v-else
              class="flex aspect-video items-center justify-center bg-muted/10 text-5xl text-accent"
          >
            {{ project.title.en.slice(0, 2) }}
          </div>

          <div class="p-6">
            <h3 class="text-2xl font-bold text-white">{{ project.title[locale] }}</h3>
            <p v-if="project.desc[locale]" class="mt-4 leading-7">
              {{ project.desc[locale] }}
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                  v-for="t in project.tech"
                  :key="t"
                  class="border border-muted/40 px-2 py-1 text-sm"
              >
                {{ t }}
              </span>
            </div>

            <div class="mt-6 flex gap-4">
              <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  class="border border-accent px-4 py-2 text-white transition hover:bg-accent/20"
              >
                {{ $t('works.visit') }}
              </a>
              <button
                  class="border border-muted/40 px-4 py-2 transition hover:border-accent"
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