<script setup>
import { onMounted, onUnmounted } from 'vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

onMounted(() => {
  const html = document.documentElement
  html.classList.add('admin-mode')
  html.lang = 'fa'
  html.dir = 'rtl'

  const meta = document.createElement('meta')
  meta.name = 'robots'
  meta.content = 'noindex'
  meta.id = 'admin-noindex'
  document.head.appendChild(meta)
})

onUnmounted(() => {
  document.documentElement.classList.remove('admin-mode')
  document.getElementById('admin-noindex')?.remove()
})
</script>

<template>
  <Toast position="top-left" />
  <ConfirmDialog />
  <RouterView />
</template>