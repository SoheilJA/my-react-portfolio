<script setup>
import {ref, onMounted, onUnmounted} from 'vue'

const progress = ref(0)

function update() {
  const h = document.documentElement.scrollHeight - window.innerHeight
  progress.value = h > 0 ? window.scrollY / h : 0
}

onMounted(() => {
  window.addEventListener('scroll', update, {passive: true})
  update()
})
onUnmounted(() => window.removeEventListener('scroll', update))
</script>

<template>
  <div
      class="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-accent"
      :style="{ transform: `scaleX(${progress})` }"
  ></div>
</template>