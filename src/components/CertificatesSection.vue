<script setup>
import {useI18n} from 'vue-i18n'
import {content} from '../data/store'
import SectionTitle from './SectionTitle.vue'

const {locale} = useI18n()
</script>

<template>
  <section id="certificates" class="py-16">
    <SectionTitle :label="$t('nav.certificates')" />

    <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
          v-reveal
          v-for="c in content.certificates"
          :key="c.id"
          class="border border-muted/40 p-6 transition hover:border-accent"
      >
        <h3 class="text-xl font-bold text-white">{{ c.title[locale] }}</h3>
        <p class="mt-2 text-sm">{{ c.issuer[locale] }}</p>
        <a
            v-if="c.link"
            :href="c.link"
            target="_blank"
            class="mt-4 inline-block text-accent hover:text-white"
        >
          {{ $t('certs.verify') }} →
        </a>
      </article>
    </div>
  </section>
</template>