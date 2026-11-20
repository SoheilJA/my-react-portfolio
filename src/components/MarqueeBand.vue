<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MarqueeStrip from './MarqueeStrip.vue'

const { t } = useI18n()
const tech = ['Django', 'Laravel', 'WordPress', 'Tailwind', 'GSAP', 'Three.js']
const words = computed(() => t('marquee.words').split('|'))
</script>

<template>
  <div
      class="relative left-1/2 my-16 w-screen -translate-x-1/2 space-y-4 border-y border-line bg-surface py-6"
  >
    <MarqueeStrip :items="tech" :direction="1" :duration="45" />
    <div class="border-t border-line pt-4">
      <MarqueeStrip :items="words" :direction="-1" size="sm" :duration="35" />
    </div>
  </div>
</template>