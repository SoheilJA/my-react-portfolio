<script setup>
import { content } from '../../data/store'

function add() {
  content.services.push({
    id: Date.now(),
    title: { fa: '', en: '' },
    desc: { fa: '', en: '' },
  })
}

function remove(i) {
  if (confirm('حذف شود؟')) content.services.splice(i, 1)
}

function move(i, dir) {
  const j = i + dir
  if (j < 0 || j >= content.services.length) return
  const [item] = content.services.splice(i, 1)
  content.services.splice(j, 0, item)
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="(s, i) in content.services" :key="s.id" class="border border-muted/40 p-4">
      <div class="flex items-center gap-2">
        <span class="text-accent">0{{ i + 1 }}</span>
        <div class="ms-auto flex gap-2">
          <button class="btn" @click="move(i, -1)">↑</button>
          <button class="btn" @click="move(i, 1)">↓</button>
          <button class="btn" @click="remove(i)">حذف</button>
        </div>
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <input v-model="s.title.fa" dir="rtl" class="field" placeholder="عنوان (فارسی)" />
        <input v-model="s.title.en" dir="ltr" class="field" placeholder="Title (English)" />
        <textarea v-model="s.desc.fa" dir="rtl" rows="3" class="field" placeholder="توضیح (فارسی)"></textarea>
        <textarea v-model="s.desc.en" dir="ltr" rows="3" class="field" placeholder="Description (English)"></textarea>
      </div>
    </div>

    <button class="btn" @click="add">+ خدمت جدید</button>
  </div>
</template>