<script setup>
import {ref} from 'vue'

const ready = ref(false)
import Preloader from './components/Preloader.vue'

const loading = ref(true)
</script>

<template>
  <Preloader
      v-if="loading && $route.path === '/'"
      @leaving="ready = true"
      @done="loading = false"
  />
  <RouterView v-if="ready || $route.path !== '/'"/>
</template>