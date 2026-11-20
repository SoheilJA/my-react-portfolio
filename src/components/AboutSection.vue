<script setup>
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import SectionTitle from './SectionTitle.vue'
import AbstractArt from './AbstractArt.vue'

const { locale } = useI18n()
</script>

<template>
  <section id="about" class="relative isolate py-24">
    <div
        class="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 border-y border-line bg-surface"
    >
      <div class="bg-glow absolute inset-0 opacity-60"></div>
    </div>

    <SectionTitle :label="$t('nav.about')" index="04" />

    <div class="mt-14 grid gap-12 lg:grid-cols-12">
      <p
          v-reveal
          class="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-medium leading-[1.7] text-ink lg:col-span-7"
      >
        {{ $t('about.text') }}
      </p>

      <aside
          v-reveal="0.15"
          class="relative self-start overflow-hidden border border-line bg-bg lg:col-span-5"
      >
        <div
            class="pointer-events-none absolute -end-16 -top-16 h-64 w-64 text-ink opacity-20"
        >
          <AbstractArt />
        </div>
        <dl class="relative divide-y divide-line">
          <div class="flex items-baseline justify-between gap-6 p-5">
            <dt class="label">{{ $t('about.label_base') }}</dt>
            <dd class="text-ink">{{ $t('contact.location') }}</dd>
          </div>
          <div class="flex items-baseline justify-between gap-6 p-5">
            <dt class="label">{{ $t('about.label_focus') }}</dt>
            <dd class="text-ink" dir="ltr">Django · Laravel · WordPress</dd>
          </div>
          <div class="flex items-baseline justify-between gap-6 p-5">
            <dt class="label">{{ $t('about.label_status') }}</dt>
            <dd class="flex items-center gap-2 text-ink">
              <span class="h-2 w-2 animate-pulse bg-accent"></span>
              {{ $t('hero.status') }}
            </dd>
          </div>
        </dl>
      </aside>
    </div>

    <h3 v-reveal class="label mt-24 text-accent">/ {{ $t('skills.title') }}</h3>

    <div class="mt-6 border-t border-line">
      <div
          v-for="g in content.skills"
          :key="g.id"
          v-reveal
          class="grid gap-4 border-b border-line py-8 md:grid-cols-12 md:items-baseline"
      >
        <span class="label md:col-span-3">{{ g.title[locale] }}</span>
        <ul class="flex flex-wrap gap-x-6 gap-y-2 md:col-span-9">
          <li
              v-for="item in g.items"
              :key="item"
              class="group flex items-center gap-6 font-display text-[clamp(1.6rem,4vw,3.2rem)] font-bold leading-[1.2] text-ink/90"
          >
            <span class="cursor-default transition-colors hover:text-accent">
              {{ item }}
            </span>
            <span class="text-accent/60 group-last:hidden">/</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>