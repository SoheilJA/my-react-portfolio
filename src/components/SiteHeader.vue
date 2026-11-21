<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MobileNavigation from './MobileNavigation.vue'

const { locale } = useI18n()
const open = ref(false)

const links = [
  { id: 'skills', key: 'nav.skills' },
  { id: 'projects', key: 'nav.works' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'certificates', key: 'nav.certificates' },
  { id: 'contact', key: 'nav.contact' },
]
</script>

<template>
  <header class="top">
    <div class="wrap">
      <a href="#hero" class="logo">
        <div class="logo-mark"><svg class="i"><use href="#i-code" /></svg></div>
        <div>
          <div class="logo-name">{{ $t('brand') }}</div>
          <div class="logo-sub">DJANGO · DESIGN</div>
        </div>
      </a>

      <nav class="main">
        <a v-for="l in links" :key="l.id" :href="'#' + l.id" class="nav-link">
          {{ $t(l.key) }}
        </a>
      </nav>

      <div class="head-actions">
        <RouterLink
          :to="locale === 'fa' ? '/en' : '/fa'"
          class="lang-btn"
          aria-label="Switch language"
        >
          {{ locale === 'fa' ? 'EN' : 'FA' }}
        </RouterLink>
        <a href="#contact" class="btn-silver">{{ $t('nav.cta') }}</a>
        <button class="burger" aria-label="Menu" :aria-expanded="open" @click="open = true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 5h14M2 13h14" />
          </svg>
        </button>
      </div>
    </div>
  </header>

  <MobileNavigation :open="open" :links="links" @close="open = false" />
</template>