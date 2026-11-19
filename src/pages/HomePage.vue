<script setup>
import SiteHeader from '../components/SiteHeader.vue'

const sections = ['home', 'services', 'works', 'about', 'contact']
</script>

<template>
  <SiteHeader />
  <main class="mx-auto max-w-6xl px-6 pt-24">
    <section v-for="s in sections" :id="s" :key="s" class="min-h-screen py-16">
      <h2 class="text-3xl font-bold text-white">
        <span class="text-accent">#</span>{{ $t('nav.' + s) }}
      </h2>
    </section>
  </main>
</template>