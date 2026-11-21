<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>

<template>
  <div class="label flex border border-line" dir="ltr">
    <RouterLink
      v-for="l in ['fa', 'en']"
      :key="l"
      :to="'/' + l"
      :hreflang="l"
      class="px-3 py-1.5 transition-colors"
      :class="locale === l ? 'bg-accent text-bg' : 'text-muted hover:text-ink'"
    >
      {{ l }}
    </RouterLink>
  </div>
</template>