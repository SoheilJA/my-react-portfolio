<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import { content } from '../data/store'

const count = (cat) => content.projects.filter((p) => p.category === cat).length

const stats = computed(() => [
  { label: 'متن‌ها', value: Object.keys(content.texts).length, icon: 'pi pi-align-right' },
  { label: 'خدمات', value: content.services.length, icon: 'pi pi-briefcase' },
  { label: 'پروژه‌های برنامه‌نویسی', value: count('code'), icon: 'pi pi-code' },
  { label: 'پروژه‌های وردپرس', value: count('wordpress'), icon: 'pi pi-wordpress' },
  {
    label: 'نمایش در صفحه اصلی',
    value: content.projects.filter((p) => p.featured).length,
    icon: 'pi pi-star',
  },
  { label: 'گواهی‌نامه‌ها', value: content.certificates.length, icon: 'pi pi-verified' },
])
</script>

<template>
  <h1 class="mb-6 text-2xl font-bold">داشبورد</h1>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <Card v-for="s in stats" :key="s.label">
      <template #content>
        <div class="flex items-center gap-4">
          <i :class="s.icon" class="text-3xl" style="color: var(--p-primary-color)"></i>
          <div>
            <div class="text-3xl font-bold">{{ s.value }}</div>
            <div class="text-sm opacity-70">{{ s.label }}</div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>