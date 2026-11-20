<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()

function logout() {
  sessionStorage.removeItem('token')
  router.push('/panel/login')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">داشبورد</h1>
    <Button
      class="mt-4"
      label="خروج"
      icon="pi pi-sign-out"
      severity="secondary"
      @click="logout"
    />
  </div>
</template>