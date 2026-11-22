<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const heroGone = ref(false)
const atContact = ref(false)
const visible = computed(() => heroGone.value && !atContact.value)
let heroIO
let contactIO

onMounted(() => {
  const hero = document.getElementById('hero')
  const contact = document.getElementById('contact')
  if (hero) {
    heroIO = new IntersectionObserver(([e]) => (heroGone.value = !e.isIntersecting))
    heroIO.observe(hero)
  }
  if (contact) {
    contactIO = new IntersectionObserver(([e]) => (atContact.value = e.isIntersecting), {
      rootMargin: '0px 0px -40% 0px',
    })
    contactIO.observe(contact)
  }
})

onUnmounted(() => {
  heroIO?.disconnect()
  contactIO?.disconnect()
})
</script>

<template>
  <div class="sticky" :class="{ visible }" :inert="!visible">
    <div>
      <div class="wrap">
        <div class="left">
          <div class="live"><span class="rec-dot"></span><span>{{ $t('st.live') }}</span></div>
          <div>
            <div class="t display">{{ $t('st.t') }}</div>
            <div class="s">{{ $t('st.s') }}</div>
          </div>
        </div>
        <a href="#contact" class="go pulse">
          <span>{{ $t('st.btn') }}</span>
          <svg class="i flip-arrow"><use href="#i-arrow" /></svg>
        </a>
      </div>
    </div>
  </div>
</template>