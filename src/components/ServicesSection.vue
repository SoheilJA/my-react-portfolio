<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import SectionTitle from './SectionTitle.vue'

const { locale } = useI18n()
const open = ref(0)
</script>

<template>
  <section id="services" class="relative isolate py-24">
    <div class="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden">
      <div class="bg-glow absolute inset-0 -scale-x-100 opacity-70"></div>
      <span
          class="text-outline absolute -bottom-10 end-6 hidden font-display text-[18rem] font-bold leading-none opacity-20 md:block"
          aria-hidden="true"
      >
        02
      </span>
    </div>

    <SectionTitle :label="$t('nav.services')" index="02" />

    <ul class="mt-4">
      <li
          v-for="(s, i) in content.services"
          :key="s.id"
          v-reveal
          class="border-b border-line"
      >
        <button
            class="group flex w-full items-center gap-6 py-8 text-start"
            :aria-expanded="open === i"
            @click="open = open === i ? -1 : i"
        >
          <span class="label w-10 shrink-0 text-accent">0{{ i + 1 }}</span>
          <span
              class="flex-1 font-display text-[clamp(1.4rem,3.4vw,2.8rem)] font-bold leading-[1.35] text-ink transition-colors group-hover:text-accent"
          >
            {{ s.title[locale] }}
          </span>
          <span
              class="text-4xl leading-none text-accent transition-transform duration-500"
              :class="open === i ? 'rotate-45' : ''"
          >
            +
          </span>
        </button>

        <div
            class="grid transition-[grid-template-rows] duration-500"
            :class="open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
          <div class="overflow-hidden">
            <p class="max-w-2xl pb-8 ps-16 leading-8">{{ s.desc[locale] }}</p>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>