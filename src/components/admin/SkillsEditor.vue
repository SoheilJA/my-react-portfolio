<script setup>
import { content } from '../../data/store'

function add() {
  content.skills.push({
    id: Date.now(),
    title: { fa: '', en: '' },
    items: [],
  })
}

function remove(i) {
  if (confirm('حذف شود؟')) content.skills.splice(i, 1)
}

function setItems(g, value) {
  g.items = value.split(',').map((s) => s.trim()).filter(Boolean)
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="(g, i) in content.skills" :key="g.id" class="border border-muted/40 p-4">
      <div class="flex items-center">
        <span class="text-accent">0{{ i + 1 }}</span>
        <button class="btn ms-auto" @click="remove(i)">حذف</button>
      </div>

      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <input v-model="g.title.fa" dir="rtl" class="field" placeholder="عنوان گروه (فارسی)" />
        <input v-model="g.title.en" dir="ltr" class="field" placeholder="Group title (English)" />
        <input
            :value="g.items.join(', ')"
            dir="ltr"
            class="field md:col-span-2"
            placeholder="Python, PHP, JavaScript"
            @change="setItems(g, $event.target.value)"
        />
      </div>
    </div>

    <button class="btn" @click="add">+ گروه جدید</button>
  </div>
</template>