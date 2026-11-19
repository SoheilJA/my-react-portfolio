<script setup>
import {ref} from 'vue'
import {
  saveContent,
  exportContent,
  importContent,
  resetContent,
} from '../data/store'
import TextsEditor from '../components/admin/TextsEditor.vue'

const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
const authed = ref(sessionStorage.getItem('admin') === '1')
const input = ref('')
const error = ref(false)
const tab = ref('texts')
const saved = ref(false)

const tabs = [{id: 'texts', label: 'متن‌ها', comp: TextsEditor}]

function login() {
  if (input.value === PASSWORD) {
    sessionStorage.setItem('admin', '1')
    authed.value = true
  } else {
    error.value = true
  }
}

function save() {
  saveContent()
  saved.value = true
  setTimeout(() => (saved.value = false), 1500)
}

function onImport(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => importContent(JSON.parse(reader.result))
  reader.readAsText(file)
}

function reset() {
  if (confirm('همه‌ی تغییرات ذخیره‌شده پاک شود؟')) resetContent()
}
</script>

<template>
  <div dir="rtl" class="mx-auto max-w-5xl p-6">
    <form
        v-if="!authed"
        class="mx-auto mt-24 max-w-sm border border-accent p-6"
        @submit.prevent="login"
    >
      <h1 class="text-2xl font-bold text-white">
        <span class="text-accent">#</span>admin
      </h1>
      <input
          v-model="input"
          type="password"
          placeholder="رمز عبور"
          class="field mt-6"
      />
      <p v-if="error" class="mt-2 text-sm text-red-400">رمز اشتباه است</p>
      <button class="btn mt-4 w-full">ورود</button>
    </form>

    <div v-else>
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="text-2xl font-bold text-white">
          <span class="text-accent">#</span>admin
        </h1>
        <div class="ms-auto flex flex-wrap gap-3">
          <button class="btn" @click="save">
            {{ saved ? 'ذخیره شد ✓' : 'ذخیره' }}
          </button>
          <button class="btn" @click="exportContent">خروجی JSON</button>
          <label class="btn cursor-pointer">
            ورودی JSON
            <input type="file" accept=".json" class="hidden" @change="onImport"/>
          </label>
          <button class="btn" @click="reset">بازنشانی</button>
        </div>
      </div>

      <div class="mt-8 flex gap-3">
        <button
            v-for="t in tabs"
            :key="t.id"
            class="border px-4 py-2"
            :class="tab === t.id ? 'border-accent text-white' : 'border-muted/40'"
            @click="tab = t.id"
        >
          {{ t.label }}
        </button>
      </div>

      <div class="mt-8">
        <component :is="tabs.find((t) => t.id === tab).comp"/>
      </div>
    </div>
  </div>
</template>