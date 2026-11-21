<script setup>
defineProps({ index: String, label: String })
</script>

<template>
  <div>
    <div
      class="label pointer-events-none absolute start-3 top-8 hidden whitespace-nowrap text-accent [writing-mode:vertical-rl] ltr:rotate-180 lg:block"
      aria-hidden="true"
    >
      {{ index }} — {{ label }}
    </div>
    <div class="label mb-6 text-accent lg:hidden">{{ index }} — {{ label }}</div>
  </div>
</template>