<script setup>
import {useI18n} from 'vue-i18n'
import {content} from '../data/store'

const {locale} = useI18n()
</script>

<template>
  <section id="about" class="py-16">
    <h2 v-reveal class="text-3xl font-bold text-white">
      <span class="text-accent">#</span>{{ $t('nav.about') }}
    </h2>

    <div class="mt-8 grid items-center gap-12 md:grid-cols-2">
      <p v-reveal class="leading-8">{{ $t('about.text') }}</p>

      <div class="relative mx-auto hidden h-64 w-64 md:block">
        <div v-float class="absolute left-0 top-0 h-40 w-40 border border-accent"></div>
        <div v-float="-14" class="absolute bottom-0 right-0 h-32 w-32 border border-accent"></div>
        <div class="dots absolute right-4 top-4 h-24 w-24"></div>
      </div>
    </div>

    <h3 v-reveal class="mt-16 text-2xl font-bold text-white">
      <span class="text-accent">#</span>{{ $t('skills.title') }}
    </h3>

    <div class="mt-8 flex flex-wrap gap-4">
      <div
          v-reveal
          v-for="g in content.skills"
          :key="g.id"
          class="min-w-44 border border-muted/40"
      >
        <div class="border-b border-muted/40 px-4 py-2 font-bold text-white">
          {{ g.title[locale] }}
        </div>
        <div class="px-4 py-3 text-sm leading-7">
          {{ g.items.join(' · ') }}
        </div>
      </div>
    </div>
  </section>
</template>