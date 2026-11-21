<script setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {content} from '../data/store'
import MarqueeStrip from './MarqueeStrip.vue'

const {locale} = useI18n()
const tech = ['Django', 'Laravel', 'WordPress', 'Tailwind', 'GSAP', 'Three.js']
const words = computed(() =>
    (content.texts['marquee.words']?.[locale.value] || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
)
</script>

<template>
    <div class="-mx-6 space-y-4 border-b border-line bg-bg2 py-6">
    <MarqueeStrip :items="tech" :direction="1" :duration="45"/>
    <div class="border-t border-line pt-4">
      <MarqueeStrip :items="words" :direction="-1" size="sm" :duration="35"/>
    </div>
  </div>
</template>