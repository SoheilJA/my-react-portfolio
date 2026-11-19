<script setup>
import {ref, computed} from 'vue'
import {content} from '../../data/store'

const q = ref('')
const rows = computed(() =>
    Object.entries(content.texts).filter(([key, v]) =>
        (key + v.fa + v.en).toLowerCase().includes(q.value.toLowerCase())
    )
)
</script>

<template>
  <div>
    <input v-model="q" class="field" placeholder="جستجو..."/>
    <div class="mt-6 space-y-4">
      <div v-for="[key, v] in rows" :key="key" class="border border-muted/40 p-4">
        <div class="text-sm text-accent" dir="ltr">{{ key }}</div>
        <div class="mt-3 grid gap-3 md:grid-cols-2">
          <textarea v-model="v.fa" dir="rtl" rows="2" class="field" placeholder="فارسی"></textarea>
          <textarea v-model="v.en" dir="ltr" rows="2" class="field" placeholder="English"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>