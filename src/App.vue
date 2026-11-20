<script setup>
import {ref} from 'vue'

import Preloader from './components/Preloader.vue'

const skip =
    sessionStorage.getItem('seen') === '1' ||
    matchMedia('(prefers-reduced-motion: reduce)').matches

const loading = ref(!skip)
const ready = ref(skip)

function done() {
  loading.value = false
  sessionStorage.setItem('seen', '1')
}</script>

<template>
  <Preloader
      v-if="loading && $route.path !== '/admin'"
      @leaving="ready = true"
      @done="done"
  />
  <RouterView v-if="ready || $route.path === '/admin'"/>
</template>