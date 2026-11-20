<script setup>
import {content} from '../data/store'
import SectionTitle from './SectionTitle.vue'
</script>

<template>
  <section id="contact" class="py-16">
    <SectionTitle :label="$t('nav.contact')"/>

    <div class="mt-8 grid gap-12 md:grid-cols-2">
      <div v-reveal>
        <p class="leading-8">{{ $t('contact.text') }}</p>
        <p class="mt-4 text-white">
          <span class="me-2 inline-block h-3 w-3 bg-accent"></span>
          {{ $t('hero.status') }}
        </p>
      </div>

      <div v-reveal class="space-y-6">
        <div class="border border-muted/40 p-6">
          <ul class="space-y-3">
            <li>
              {{ $t('contact.email') }}:
              <a :href="'mailto:' + content.contact.email" class="text-white hover:text-accent">
                {{ content.contact.email }}
              </a>
            </li>
            <li>
              {{ $t('contact.phone') }}:
              <a
                  :href="'tel:' + content.contact.phone"
                  dir="ltr"
                  class="inline-block text-white hover:text-accent"
              >
                {{ content.contact.phone }}
              </a>
            </li>
            <li>{{ $t('contact.location') }}</li>
          </ul>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <span>{{ $t('contact.social') }}:</span>
          <template v-for="s in content.contact.socials" :key="s.id">
            <a
                v-if="s.url"
                :href="s.url"
                target="_blank"
                class="border border-muted/40 px-3 py-1 transition hover:border-accent hover:text-white"
            >
              {{ s.name }}
            </a>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>