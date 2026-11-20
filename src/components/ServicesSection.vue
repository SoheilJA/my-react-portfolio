<script setup>
import {useI18n} from "vue-i18n";
import {content} from "../data/store";
import SectionTitle from './SectionTitle.vue'

const {locale} = useI18n();
</script>

<template>
  <section id="services" class="py-16">
    <SectionTitle :label="$t('nav.services')"/>
    <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
          v-reveal
          v-for="(s, i) in content.services"
          :key="s.id"
          class="border border-muted/40 p-6 transition hover:border-accent"
      >
        <span class="text-accent">0{{ i + 1 }}</span>
        <h3 class="mt-3 text-lg font-bold text-white">{{ s.title[locale] }}</h3>
        <p class="mt-3 text-sm leading-7">{{ s.desc[locale] }}</p>
      </article>
    </div>
  </section>
</template>
