<script setup>
defineProps({ label: String })
</script>

<template>
  <div v-reveal class="flex items-center gap-4">
    <h2 class="whitespace-nowrap text-3xl font-bold text-white">
      <span class="text-accent">#</span>{{ label }}
    </h2>
    <div class="h-px flex-1 bg-accent/60"></div>
  </div>
</template>