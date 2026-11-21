<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from '../data/store'
import SectionContainer from './SectionContainer.vue'

const { locale } = useI18n()

const certNames = computed(() =>
  content.certificates.map((c) => c.title[locale.value]).join(' · ')
)
const stack = computed(() =>
  content.skills.flatMap((g) => g.items).slice(0, 8).join(' · ')
)
</script>

<template>
  <div class="-mx-6">
    <SectionContainer id="about" index="02" :label="$t('label.about')">
      <div class="grid gap-12 lg:grid-cols-12">
        <div class="lg:col-span-7">
          <h2
            v-reveal
            class="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[1.45] text-ink ltr:leading-[1.15] ltr:tracking-tight"
          >
            {{ $t('about.heading') }}
          </h2>
          <p v-reveal class="mt-8 max-w-2xl text-lg leading-9">
            {{ $t('about.text') }}
          </p>
        </div>

        <dl v-reveal class="self-start border border-line lg:col-span-5">
          <div class="border-b border-line p-5">
            <dt class="label text-accent">{{ $t('about.label_base') }}</dt>
            <dd class="mt-2 text-ink">{{ $t('contact.location') }}</dd>
          </div>
          <div class="border-b border-line p-5">
            <dt class="label text-accent">{{ $t('about.label_focus') }}</dt>
            <dd class="mt-2 text-ink" dir="ltr">Django · Laravel · WordPress</dd>
          </div>
          <div class="border-b border-line p-5">
            <dt class="label text-accent">{{ $t('about.stack') }}</dt>
            <dd class="mt-2 text-ink" dir="ltr">{{ stack }}</dd>
          </div>
          <div class="border-b border-line p-5">
            <dt class="label text-accent">{{ $t('about.certs') }}</dt>
            <dd class="mt-2 text-ink" dir="ltr">{{ certNames }}</dd>
          </div>
          <div class="p-5">
            <dt class="label text-accent">{{ $t('about.label_status') }}</dt>
            <dd class="mt-2 flex items-center gap-2 text-ink">
              <span class="h-2 w-2 animate-pulse bg-accent"></span>
              {{ $t('hero.status') }}
            </dd>
          </div>
        </dl>
      </div>
    </SectionContainer>
  </div>
</template>