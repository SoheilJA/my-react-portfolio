<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LangSwitch from './LangSwitch.vue'
import MobileNavigation from './MobileNavigation.vue'

const open = ref(false)
const active = ref('home')
const links = ['services', 'works', 'about', 'certificates']
const mobileLinks = [...links, 'contact']
const ids = ['home', ...mobileLinks]
let io

onMounted(() => {
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => e.isIntersecting && (active.value = e.target.id)),
    { rootMargin: '-45% 0px -50% 0px' }
  )
  ids.forEach((id) => {
    const el = document.getElementById(id)
    if (el) io.observe(el)
  })
})

onUnmounted(() => io?.disconnect())
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
    <div class="mx-auto flex h-14 max-w-[1280px] items-center gap-6 px-6">
      <a href="#home" class="flex items-center gap-2 font-bold text-ink">
        <span class="grid h-6 w-6 place-items-center bg-accent text-sm text-bg">S</span>
        Soheil
      </a>

      <nav class="ms-auto hidden h-full items-center gap-6 text-sm md:flex">
        <a
          v-for="l in links"
          :key="l"
          :href="'#' + l"
          class="relative flex h-full items-center transition-colors"
          :class="active === l ? 'text-ink' : 'text-muted hover:text-ink'"
        >
          {{ $t('nav.' + l) }}
          <span
            class="absolute inset-x-0 bottom-0 h-px bg-accent transition-transform duration-300"
            :class="active === l ? 'scale-x-100' : 'scale-x-0'"
          ></span>
        </a>
      </nav>

      <div class="ms-auto flex items-center gap-3 md:ms-0">
        <LangSwitch />
        <a
          href="#contact"
          class="hidden bg-accent px-4 py-1.5 text-sm font-bold text-bg transition hover:bg-accent2 md:block"
        >
          {{ $t('nav.contact') }}
        </a>
        <button
          class="grid h-9 w-9 place-items-center border border-line text-ink md:hidden"
          :aria-expanded="open"
          aria-label="Menu"
          @click="open = true"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 5h14M2 13h14" />
          </svg>
        </button>
      </div>
    </div>
  </header>

  <MobileNavigation :open="open" :links="mobileLinks" @close="open = false" />
</template>