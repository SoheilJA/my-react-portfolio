<script setup>
import { content } from '../../data/store'

function add() {
  content.contact.socials.push({ id: Date.now(), name: '', url: '' })
}

function remove(i) {
  content.contact.socials.splice(i, 1)
}
</script>

<template>
  <div class="space-y-8">
    <div class="grid gap-3 md:grid-cols-2">
      <input v-model="content.contact.email" dir="ltr" class="field" placeholder="Email" />
      <input v-model="content.contact.phone" dir="ltr" class="field" placeholder="+98..." />
    </div>

    <div>
      <h3 class="mb-4 text-ink">شبکه‌های اجتماعی (لینک خالی نمایش داده نمی‌شه)</h3>
      <div class="space-y-3">
        <div
            v-for="(s, i) in content.contact.socials"
            :key="s.id"
            class="flex flex-wrap gap-3"
        >
          <input v-model="s.name" dir="ltr" class="field !w-40" placeholder="GitHub" />
          <input v-model="s.url" dir="ltr" class="field flex-1" placeholder="https://..." />
          <button class="btn" @click="remove(i)">حذف</button>
        </div>
      </div>
      <button class="btn mt-4" @click="add">+ شبکه جدید</button>
    </div>
  </div>
</template>