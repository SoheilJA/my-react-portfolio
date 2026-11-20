<script setup>
import {ref, onMounted} from 'vue'
import {
  saveContent,
  exportContent,
  importContent,
  resetContent,
} from '../data/store'
import TextsEditor from '../components/admin/TextsEditor.vue'
import ServicesEditor from '../components/admin/ServicesEditor.vue'
import CertificatesEditor from '../components/admin/CertificatesEditor.vue'
import ProjectsEditor from '../components/admin/ProjectsEditor.vue'
import SkillsEditor from '../components/admin/SkillsEditor.vue'
import ContactEditor from '../components/admin/ContactEditor.vue'

const authed = ref(Boolean(sessionStorage.getItem('token')))
const input = ref('')
const error = ref(false)
const tab = ref('texts')
const saved = ref(false)
onMounted(() => {
  const m = document.createElement('meta')
  m.name = 'robots'
  m.content = 'noindex'
  document.head.appendChild(m)
})

const tabs = [
  {id: 'texts', label: 'متن‌ها', comp: TextsEditor},
  {id: 'services', label: 'خدمات', comp: ServicesEditor},
  {id: 'certs', label: 'گواهی‌نامه‌ها', comp: CertificatesEditor},
  {id: 'projects', label: 'نمونه‌کارها', comp: ProjectsEditor},
  {id: 'skills', label: 'مهارت‌ها', comp: SkillsEditor},
  {id: 'contact', label: 'تماس', comp: ContactEditor},
]

async function login() {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {Authorization: `Bearer ${input.value}`},
  })
  if (res.ok) {
    sessionStorage.setItem('token', input.value)
    authed.value = true
    error.value = false
  } else {
    error.value = true
  }
}

async function save() {
  try {
    await saveContent()
    saved.value = true
    setTimeout(() => (saved.value = false), 1500)
  } catch {
    alert('ذخیره نشد. دوباره وارد شو.')
  }
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
      <h1 class="text-2xl font-bold text-ink">
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
        <h1 class="text-2xl font-bold text-ink">
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
            :class="tab === t.id ? 'border-accent text-ink' : 'border-muted/40'"
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