<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'

const { locale } = useI18n()

const code = [
  [['{', 'p']],
  [['  "name"', 'k'], [': ', 'p'], ['"Soheil Jalal Ahmadi"', 's'], [',', 'p']],
  [['  "role"', 'k'], [': ', 'p'], ['"Web developer & designer"', 's'], [',', 'p']],
  [['  "location"', 'k'], [': ', 'p'], ['"Mashhad, Iran"', 's'], [',', 'p']],
  [['  "stack"', 'k'], [': ', 'p'], ['["Django", "Laravel", "WordPress", "Tailwind"]', 's'], [',', 'p']],
  [['  "available"', 'k'], [': ', 'p'], ['true', 'a']],
  [['}', 'p']],
]
const tone = { k: 'text-accent2', s: 'text-ink', p: 'text-faint', a: 'text-accent' }

const project = computed(
  () =>
    content.projects.find((p) => p.category === 'code' && p.featured) ||
    content.projects[0]
)
const count = (cat) => content.projects.filter((p) => p.category === cat).length
</script>

<template>
  <div class="bg-dots px-6 py-10 md:px-12 md:py-14 lg:ps-20">
    <div class="grid gap-6 lg:grid-cols-12">
      <div class="hero-win border border-line2 bg-surface lg:col-span-7" dir="ltr">
        <div class="flex items-center gap-2 border-b border-line px-4 py-3">
          <span v-for="n in 3" :key="n" class="h-2.5 w-2.5 rounded-full bg-faint/50"></span>
          <span class="label ms-3 text-faint">profile.json</span>
        </div>
        <pre class="overflow-x-auto p-5 font-mono text-sm leading-7"><code><span v-for="(line, i) in code" :key="i" class="block"><span class="me-5 inline-block w-4 select-none text-end text-faint/60">{{ i + 1 }}</span><span v-for="(t, j) in line" :key="j" :class="tone[t[1]]">{{ t[0] }}</span></span></code></pre>
      </div>

      <div
        v-if="project"
        class="hero-win self-start border border-line2 bg-surface lg:col-span-5 lg:mt-10"
      >
        <div class="flex items-center gap-2 border-b border-line px-4 py-3">
          <span v-for="n in 3" :key="n" class="h-2.5 w-2.5 rounded-full bg-faint/50"></span>
          <span class="label ms-3 truncate text-faint" dir="ltr">{{ project.title.en }}</span>
        </div>
        <div class="aspect-video border-b border-line">
          <img
            v-if="project.image"
            :src="project.image"
            :alt="project.title[locale]"
            class="h-full w-full object-cover"
          />
          <div v-else class="bg-grid flex h-full items-center justify-center">
            <span class="text-outline text-6xl font-bold" dir="ltr">
              {{ project.title.en.slice(0, 2) }}
            </span>
          </div>
        </div>
        <div class="p-5">
          <h3 class="text-xl font-bold text-ink">{{ project.title[locale] }}</h3>
          <p class="label mt-2 text-faint" dir="ltr">{{ project.tech.join(' / ') }}</p>
        </div>
        <div class="grid grid-cols-2 border-t border-line">
          <a href="#works" class="p-4 transition-colors hover:bg-raised">
            <span class="block text-2xl font-bold text-ink" dir="ltr">{{ count('code') }}</span>
            <span class="label text-faint">{{ $t('works.tab_code') }}</span>
          </a>
          <a href="#works" class="border-s border-line p-4 transition-colors hover:bg-raised">
            <span class="block text-2xl font-bold text-ink" dir="ltr">{{ count('wordpress') }}</span>
            <span class="label text-faint">{{ $t('works.tab_wp') }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>