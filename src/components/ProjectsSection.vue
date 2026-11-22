<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import { useInView } from '../lib/useInView'
import ProjectModal from './ProjectModal.vue'

const { locale } = useI18n()
const { el, seen } = useInView(0.05)

const filter = ref('all')
const showAll = ref(false)
const selected = ref(null)

const filters = [
  { id: 'all', key: 'pj.all' },
  { id: 'code', key: 'works.tab_code' },
  { id: 'wordpress', key: 'works.tab_wp' },
]

const pad = (n) => String(n).padStart(2, '0')

const inFilter = computed(() =>
  content.projects.filter((p) => filter.value === 'all' || p.category === filter.value)
)
const featured = computed(() => inFilter.value.filter((p) => p.featured))
const list = computed(() =>
  showAll.value || !featured.value.length ? inFilter.value : featured.value
)
const hasMore = computed(
  () => featured.value.length > 0 && inFilter.value.length > featured.value.length
)

function setFilter(id) {
  filter.value = id
  showAll.value = false
}
</script>

<template>
  <section id="projects" ref="el" class="sec alt">
    <div class="wrap">
      <div class="reveal sec-head" :class="{ 'in-view': seen }">
        <div>
          <div class="marker"><span>{{ $t('pj.marker') }}</span></div>
          <h2 class="display sec-title">
            <span>{{ $t('pj.t1') }}</span><br />
            <span class="accent">{{ $t('pj.t2') }}</span>
            <span class="stroke">{{ $t('pj.t3') }}</span>
          </h2>
        </div>
        <div>
          <p class="sec-text">{{ $t('pj.text') }}</p>
          <div class="pills">
            <button
              v-for="f in filters"
              :key="f.id"
              class="pill"
              :class="{ active: filter === f.id }"
              @click="setFilter(f.id)"
            >
              {{ $t(f.key) }}
            </button>
          </div>
        </div>
      </div>

      <div class="proj-grid">
        <article
          v-for="(p, i) in list"
          :key="p.id"
          class="proj card notch"
          tabindex="0"
          role="button"
          style="cursor: pointer"
          @click="selected = p"
          @keydown.enter="selected = p"
        >
          <div class="shot">
            <img v-if="p.image" :src="p.image" :alt="p.title[locale]" loading="lazy" />
            <span class="tag idx">
              {{ pad(i + 1) }} / {{ p.category === 'code' ? 'CODE' : 'WP' }}
            </span>
            <span class="tag type" :class="{ wp: p.category === 'wordpress' }">
              {{ p.category === 'code' ? $t('works.tab_code') : $t('works.tab_wp') }}
            </span>
          </div>

          <div class="proj-body">
            <h3 class="display">{{ p.title[locale] }}</h3>
            <p v-if="p.desc[locale]">{{ p.desc[locale] }}</p>
            <div class="chips">
              <span v-for="t in p.tech" :key="t" class="chip">{{ t }}</span>
            </div>

            <a
              v-if="p.link"
              class="proj-link"
              :href="p.link"
              target="_blank"
              rel="noopener"
              @click.stop
            >
              <span>{{ $t('works.visit') }}</span>
              <svg class="i"><use href="#i-ext" /></svg>
            </a>
            <span v-else class="proj-link">
              <span>{{ $t('pj.details') }}</span>
              <svg class="i"><use href="#i-arrow" /></svg>
            </span>
          </div>
        </article>
      </div>

      <div v-if="hasMore" style="display: flex; justify-content: center; margin-top: 56px">
        <button class="more-btn" @click="showAll = !showAll">
          {{ showAll ? $t('works.less') : $t('works.more') }}
          <span>{{ showAll ? '↑' : '↓' }}</span>
        </button>
      </div>
    </div>

    <ProjectModal :project="selected" @close="selected = null" />
  </section>
</template>