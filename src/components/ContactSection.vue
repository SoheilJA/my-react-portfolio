<script setup>
import { ref, computed } from 'vue'
import { content } from '../data/store'
import SectionTitle from './SectionTitle.vue'

const copied = ref(false)
const socials = computed(() => content.contact.socials.filter((s) => s.url))

async function copy() {
  try {
    await navigator.clipboard.writeText(content.contact.email)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // مرورگر اجازه نداد
  }
}
</script>

<template>
  <section id="contact" class="relative isolate overflow-hidden py-24">
    <div
        class="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
    >
      <div class="bg-grid fade-mask absolute inset-0 opacity-40"></div>
      <div class="bg-glow-bottom absolute inset-x-0 bottom-0 h-3/4"></div>
    </div>

    <SectionTitle :label="$t('nav.contact')" index="06" />

    <h3
        v-reveal
        class="mt-16 font-display text-[clamp(2.8rem,9vw,8rem)] font-bold leading-[1.2] tracking-tight text-ink"
    >
      {{ $t('contact.headline_1') }}
      <span class="block text-accent">{{ $t('contact.headline_2') }}</span>
    </h3>

    <p v-reveal class="mt-8 max-w-xl text-lg leading-8">
      {{ $t('contact.text') }}
    </p>

    <p v-reveal class="mt-6 flex items-center gap-3 text-ink">
      <span class="h-2.5 w-2.5 animate-pulse bg-accent"></span>
      {{ $t('hero.status') }}
    </p>

    <div v-reveal class="mt-8 flex flex-wrap gap-4">
      <a
          v-magnetic
          :href="'mailto:' + content.contact.email"
          class="bg-accent px-6 py-3 font-bold text-bg transition hover:bg-ink"
      >
        {{ $t('hero.cta') }}
      </a>
      <button
          v-magnetic
          class="border border-line px-6 py-3 text-ink transition hover:border-accent"
          @click="copy"
      >
        {{ copied ? $t('contact.copied') : $t('contact.copy') }}
      </button>
    </div>

    <a
        v-reveal
        :href="'mailto:' + content.contact.email"
        dir="ltr"
        class="group mt-14 inline-flex max-w-full items-center gap-4 break-all border-b border-line pb-4 font-display text-[clamp(1.1rem,3.6vw,2.6rem)] font-bold text-ink transition-colors hover:border-accent hover:text-accent"
    >
      {{ content.contact.email }}
      <span class="text-accent transition-transform group-hover:translate-x-2">↗</span>
    </a>

    <div
        v-reveal
        class="mt-16 grid gap-px border border-line bg-line md:grid-cols-3"
    >
      <div class="bg-bg p-6">
        <p class="label">{{ $t('contact.phone') }}</p>
        <a
            :href="'tel:' + content.contact.phone"
            dir="ltr"
            class="mt-3 inline-block text-ink transition-colors hover:text-accent"
        >
          {{ content.contact.phone }}
        </a>
      </div>
      <div class="bg-bg p-6">
        <p class="label">{{ $t('about.label_base') }}</p>
        <p class="mt-3 text-ink">{{ $t('contact.location') }}</p>
      </div>
      <div class="bg-bg p-6">
        <p class="label">{{ $t('contact.social') }}</p>
        <div class="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          <a
              v-for="s in socials"
              :key="s.id"
              :href="s.url"
              target="_blank"
              rel="noopener"
              class="text-ink transition-colors hover:text-accent"
          >
            {{ s.name }} ↗
          </a>
          <span v-if="!socials.length">—</span>
        </div>
      </div>
    </div>
  </section>
</template>