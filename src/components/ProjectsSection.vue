<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import SectionTitle from './SectionTitle.vue'
import ProjectModal from './ProjectModal.vue'

const { locale } = useI18n()
const tab = ref('code')
const showAll = ref(false)
const selected = ref(null)

const tabs = [
  { id: 'code', label: 'works.tab_code' },
  { id: 'wordpress', label: 'works.tab_wp' },
]

const count = (id) => content.projects.filter((p) => p.category === id).length
const inTab = computed(() =>
    content.projects.filter((p) => p.category === tab.value)
)
const featured = computed(() => inTab.value.filter((p) => p.featured))
const list = computed(() => (showAll.value ? inTab.value : featured.value))
const hasMore = computed(() => inTab.value.length > featured.value.length)

function setTab(id) {
  tab.value = id
  showAll.value = false
}

const isHero = (i) => tab.value === 'code' && i === 0
</script>

<template>
  <section id="works" class="relative isolate py-24">
    <div
        class="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
    >
      <div class="bg-grid fade-mask absolute inset-0 opacity-50"></div>
    </div>

    <SectionTitle :label="$t('nav.works')" index="03" />

    <div class="mt-10 flex flex-wrap gap-x-10 gap-y-3">
      <button
          v-for="t in tabs"
          :key="t.id"
          class="flex items-start gap-2 font-display text-[clamp(1.6rem,4vw,3rem)] font-bold leading-[1.3] transition-colors"
          :class="tab === t.id ? 'text-ink' : 'text-muted/60 hover:text-ink'"
          @click="setTab(t.id)"
      >
        {{ $t(t.label) }}
        <sup class="label mt-2 text-accent" dir="ltr">{{ count(t.id) }}</sup>
      </button>
    </div>

    <div
        :key="tab"
        class="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2"
        :class="tab === 'wordpress' ? 'lg:grid-cols-3' : ''"
    >
      <article
          v-for="(p, i) in list"
          :key="p.id"
          v-reveal
          tabindex="0"
          role="button"
          class="group cursor-pointer outline-none"
          :class="isHero(i) ? 'md:col-span-2' : ''"
          @click="selected = p"
          @keydown.enter="selected = p"
      >
        <div
            class="relative overflow-hidden border border-line bg-surface transition-colors group-hover:border-accent group-focus-visible:border-accent"
            :class="isHero(i) ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[4/3]'"
        >
          <img
              v-if="p.image"
              :src="p.image"
              :alt="p.title[locale]"
              loading="lazy"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div v-else class="bg-grid absolute inset-0 flex items-center justify-center">
            <span class="text-outline font-display text-7xl font-bold">
              {{ p.title.en.slice(0, 2) }}
            </span>
          </div>

          <div
              class="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-bg/80 via-transparent p-4 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <span class="label text-accent">{{ $t('works.view') }}</span>
            <span class="text-2xl text-accent">↗</span>
          </div>
        </div>

        <div class="mt-4 flex items-baseline gap-4">
          <span class="label text-accent" dir="ltr">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <h3
              class="font-display text-xl font-bold leading-[1.4] text-ink transition-colors group-hover:text-accent md:text-2xl"
          >
            {{ p.title[locale] }}
          </h3>
        </div>
        <p class="mt-2 ps-9">
          <span class="label" dir="ltr">{{ p.tech.join(' / ') }}</span>
        </p>
      </article>
    </div>

    <div v-if="hasMore" class="mt-14 flex justify-center">
      <button
          class="flex items-center gap-3 border border-line px-8 py-4 text-ink transition hover:border-accent hover:bg-accent hover:text-bg"
          @click="showAll = !showAll"
      >
        {{ showAll ? $t('works.less') : $t('works.more') }}
        <span>{{ showAll ? '↑' : '↓' }}</span>
      </button>
    </div>

    <ProjectModal :project="selected" @close="selected = null" />
  </section>
</template>