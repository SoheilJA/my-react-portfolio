<script setup>
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import SectionContainer from './SectionContainer.vue'
import ServiceIcon from './ServiceIcon.vue'

const { locale } = useI18n()

const spans = [
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
]
const span = (i) => spans[i % spans.length]
const wide = (i) => i % spans.length === 0
</script>

<template>
  <div class="-mx-6">
    <SectionContainer id="services" index="03" :label="$t('label.services')">
      <h2
        v-reveal
        class="max-w-3xl text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[1.45] text-ink ltr:leading-[1.15] ltr:tracking-tight"
      >
        {{ $t('services.heading') }}
      </h2>

      <div class="mt-12 grid border-s border-t border-line md:grid-cols-2 lg:grid-cols-12">
        <a
          v-for="(s, i) in content.services"
          :key="s.id"
          v-reveal
          href="#contact"
          class="group relative flex flex-col overflow-hidden border-b border-e border-line p-6 transition-colors hover:bg-surface md:p-8"
          :class="span(i)"
        >
          <span
            class="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
          ></span>
          <div
            v-if="wide(i)"
            class="bg-dots pointer-events-none absolute -bottom-6 -end-6 hidden h-40 w-56 opacity-70 lg:block"
            aria-hidden="true"
          ></div>

          <div class="flex items-start justify-between">
            <ServiceIcon :index="i" class="h-8 w-8 text-accent" />
            <span class="label text-faint" dir="ltr">0{{ i + 1 }}</span>
          </div>

          <h3 class="mt-10 text-xl font-bold leading-[1.5] text-ink md:text-2xl">
            {{ s.title[locale] }}
          </h3>
          <p class="mt-3 max-w-md leading-8">{{ s.desc[locale] }}</p>

          <span class="label mt-auto flex items-center gap-2 pt-8 text-accent">
            {{ $t('services.cta') }}
            <span
              class="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </span>
        </a>
      </div>
    </SectionContainer>
  </div>
</template>