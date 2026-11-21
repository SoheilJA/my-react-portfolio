<script setup>
import SectionLabel from './SectionLabel.vue'

defineProps({ id: String, index: String, label: String })
</script>

<template>
  <section :id="id" class="relative border-b border-line">
    <div class="px-6 py-20 md:px-12 lg:ps-20">
      <SectionLabel :index="index" :label="label" />
      <slot />
    </div>
  </section>
</template>