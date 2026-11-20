<script setup>
import {content} from '../../data/store'

function add() {
  content.certificates.push({
    id: Date.now(),
    title: {fa: '', en: ''},
    issuer: {fa: '', en: ''},
    link: '',
  })
}

function remove(i) {
  if (confirm('حذف شود؟')) content.certificates.splice(i, 1)
}

function move(i, dir) {
  const j = i + dir
  if (j < 0 || j >= content.certificates.length) return
  const [item] = content.certificates.splice(i, 1)
  content.certificates.splice(j, 0, item)
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="(c, i) in content.certificates" :key="c.id" class="border border-muted/40 p-4">
      <div class="flex items-center gap-2">
        <span class="text-accent">0{{ i + 1 }}</span>
        <div class="ms-auto flex gap-2">
          <button class="btn" @click="move(i, -1)">↑</button>
          <button class="btn" @click="move(i, 1)">↓</button>
          <button class="btn" @click="remove(i)">حذف</button>
        </div>
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <input v-model="c.title.fa" dir="rtl" class="field" placeholder="عنوان (فارسی)"/>
        <input v-model="c.title.en" dir="ltr" class="field" placeholder="Title (English)"/>
        <input v-model="c.issuer.fa" dir="rtl" class="field" placeholder="صادرکننده (فارسی)"/>
        <input v-model="c.issuer.en" dir="ltr" class="field" placeholder="Issuer (English)"/>
        <input v-model="c.link" dir="ltr" class="field md:col-span-2" placeholder="https://..."/>
        <input v-model="c.image" dir="ltr" class="field md:col-span-2" placeholder="/certs/cs50x.webp" />
      </div>
    </div>

    <button class="btn" @click="add">+ گواهی‌نامه جدید</button>
  </div>
</template>