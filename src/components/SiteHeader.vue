<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const open = ref(false)
const active = ref('home')
const navLinks = ['services', 'works', 'about', 'certificates', 'contact']
const allIds = ['home', ...navLinks]
let io

onMounted(() => {
  io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) active.value = e.target.id
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
  )
  allIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) io.observe(el)
  })
})

onUnmounted(() => io?.disconnect())
</script>

<template>
  <header
      class="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <a
          href="#home"
          class="font-display text-xl font-bold text-ink"
          @click="open = false"
      >
        Soheil<span class="text-accent">.</span>
      </a>

      <nav class="hidden items-center gap-7 md:flex">
        <a
            v-for="(l, i) in navLinks"
            :key="l"
            :href="'#' + l"
            class="label relative py-2 transition-colors"
            :class="active === l ? 'text-ink' : 'hover:text-ink'"
        >
          <span class="text-accent" dir="ltr">0{{ i + 2 }}</span>
          {{ $t('nav.' + l) }}
          <span
              class="absolute inset-x-0 bottom-0 h-px origin-left bg-accent transition-transform duration-300"
              :class="active === l ? 'scale-x-100' : 'scale-x-0'"
          ></span>
        </a>
        <RouterLink
            :to="locale === 'fa' ? '/en' : '/fa'"
            class="label border border-line px-3 py-1.5 text-ink transition-colors hover:border-accent"
        >
          {{ locale === 'fa' ? 'EN' : 'FA' }}
        </RouterLink>
      </nav>

      <button
          class="label text-ink md:hidden"
          :aria-expanded="open"
          @click="open = !open"
      >
        {{ open ? '✕' : '☰' }}
      </button>
    </div>
  </header>

  <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
  >
    <nav
        v-if="open"
        class="fixed inset-0 z-30 flex flex-col gap-6 bg-bg px-6 pt-28 md:hidden"
    >
      <a
          v-for="(l, i) in navLinks"
          :key="l"
          :href="'#' + l"
          class="flex items-baseline gap-4 border-b border-line pb-4 font-display text-3xl font-bold text-ink"
          @click="open = false"
      >
        <span class="label text-accent" dir="ltr">0{{ i + 2 }}</span>
        {{ $t('nav.' + l) }}
      </a>
      <RouterLink
          :to="locale === 'fa' ? '/en' : '/fa'"
          class="label w-fit border border-line px-4 py-2 text-ink"
          @click="open = false"
      >
        {{ locale === 'fa' ? 'English' : 'فارسی' }}
      </RouterLink>
    </nav>
  </Transition>
</template>