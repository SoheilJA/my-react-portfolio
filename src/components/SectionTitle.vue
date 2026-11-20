<script setup>
defineProps({ label: String, index: String })
</script>

<template>
  <div
      v-reveal
      class="flex items-end justify-between gap-6 border-b border-line pb-6"
  >
    <h2
        class="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[1.25] text-ink"
    >
      {{ label }}
    </h2>
    <span v-if="index" class="label pb-3 text-accent" dir="ltr">/ {{ index }}</span>
  </div>
</template>