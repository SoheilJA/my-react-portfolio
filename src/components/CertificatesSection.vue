<script setup>
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import SectionTitle from './SectionTitle.vue'

const { locale } = useI18n()
</script>

<template>
  <section id="certificates" class="relative isolate py-24">
    <div
        class="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden"
    >
      <div class="bg-grid fade-mask absolute inset-0 opacity-40"></div>
      <span
          class="text-outline absolute -top-6 start-4 hidden font-display text-[18rem] font-bold leading-none opacity-20 md:block"
          aria-hidden="true"
      >
        05
      </span>
    </div>

    <SectionTitle :label="$t('nav.certificates')" index="05" />

    <div class="mt-14 grid gap-8 md:grid-cols-3">
      <article
          v-for="(c, i) in content.certificates"
          :key="c.id"
          v-reveal
          class="group"
          :class="i % 2 ? 'md:mt-12' : ''"
      >
        <div
            class="relative aspect-[4/3] overflow-hidden border border-line bg-surface transition-colors group-hover:border-accent"
        >
          <img
              v-if="c.image"
              :src="c.image"
              :alt="c.title[locale]"
              loading="lazy"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div
              v-else
              class="bg-grid absolute inset-0 flex items-center justify-center p-4 text-center"
          >
            <span class="text-outline font-display text-5xl font-bold" dir="ltr">
              {{ c.title.en }}
            </span>
          </div>
        </div>

        <div class="mt-5 flex items-baseline gap-4">
          <span class="label text-accent" dir="ltr">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <h3 class="font-display text-2xl font-bold leading-[1.4] text-ink">
            {{ c.title[locale] }}
          </h3>
        </div>

        <div class="ps-9">
          <p class="mt-2">{{ c.issuer[locale] }}</p>
          <a
              v-if="c.link"
              :href="c.link"
              target="_blank"
              rel="noopener"
              class="label mt-4 inline-block text-accent transition-colors hover:text-ink"
          >
            {{ $t('certs.verify') }} ↗
          </a>
        </div>
      </article>
    </div>
  </section>
</template>