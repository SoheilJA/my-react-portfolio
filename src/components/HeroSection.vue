<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeroSplit from './heroes/HeroSplit.vue'
import HeroTerminal from './heroes/HeroTerminal.vue'
import HeroKinetic from './heroes/HeroKinetic.vue'

const route = useRoute()
const order = ['a', 'b', 'c']
const initial = String(route.query.hero || 'a').toLowerCase()
const current = ref(order.includes(initial) ? initial : 'a')
const map = { a: HeroSplit, b: HeroTerminal, c: HeroKinetic }
const HeroComp = computed(() => map[current.value] || HeroSplit)
const isDev = import.meta.env.DEV
</script>

<template>
  <component :is="HeroComp" />

  <div v-if="isDev" class="hero-switcher" dir="ltr">
    <span class="hs-label">HERO</span>
    <button
        v-for="v in order"
        :key="v"
        :class="{ active: current === v }"
        @click="current = v"
    >{{ v.toUpperCase() }}</button>
  </div>
</template>

<style scoped>
.hero-switcher {
  position: fixed;
  z-index: 40;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border: 1px solid var(--border-light);
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(8px);
}
.hs-label {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.2em;
  color: var(--muted);
  padding: 0 4px;
}
.hero-switcher button {
  width: 34px;
  height: 30px;
  font-family: var(--f-mono);
  font-size: 12px;
  color: var(--fg-dim);
  border: 1px solid transparent;
  transition: all 0.2s;
}
.hero-switcher button:hover {
  color: var(--fg);
}
.hero-switcher button.active {
  background: var(--accent);
  color: #000;
}
</style>