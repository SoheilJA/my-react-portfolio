<script setup>
import { ref } from 'vue'
import Preloader from './components/Preloader.vue'

const loading = ref(true)
</script>

<template>
  <Preloader v-if="loading && $route.path === '/'" @done="loading = false" />
  <RouterView />
</template>