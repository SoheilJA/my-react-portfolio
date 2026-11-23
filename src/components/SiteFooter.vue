<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import { socialIcon } from '../lib/socialIcon'

const { locale } = useI18n()
const pages = [
  { id: 'skills', key: 'nav.skills' },
  { id: 'projects', key: 'nav.works' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'certificates', key: 'nav.certificates' },
]
const socials = computed(() => content.contact.socials.filter((s) => s.url))
</script>

<template>
  <footer class="foot">
    <div class="foot-bg">AHMADI</div>
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <div class="logo">
            <div class="logo-mark"><svg class="i"><use href="#i-code" /></svg></div>
            <div>
              <div class="logo-name">{{ $t('brand') }}</div>
              <div class="logo-sub">MASHHAD · IRAN</div>
            </div>
          </div>
          <p>{{ $t('ft.text') }}</p>
          <div class="socials">
            <a
              v-for="s in socials"
              :key="s.id"
              class="soc"
              :href="s.url"
              target="_blank"
              rel="noopener"
              :aria-label="s.name"
            >
              <svg class="i"><use :href="'#' + socialIcon(s.name)" /></svg>
            </a>
          </div>
        </div>

        <div>
          <h5>{{ $t('ft.nav') }}</h5>
          <ul>
            <li v-for="p in pages" :key="p.id">
              <a :href="'#' + p.id">{{ $t(p.key) }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h5>{{ $t('ft.svc') }}</h5>
          <ul>
            <li v-for="s in content.services" :key="s.id">
              <a href="#contact">{{ s.title[locale] }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="copy">
        <div>{{ $t('footer.rights') }}</div>
        <div>{{ $t('ft.built') }}</div>
      </div>
    </div>
  </footer>
</template>