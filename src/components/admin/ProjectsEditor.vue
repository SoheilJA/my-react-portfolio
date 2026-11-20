<script setup>
import {ref, computed} from 'vue'
import {content, uploadImage} from '../../data/store'

const cat = ref('all')

const list = computed(() =>
    content.projects.filter((p) => cat.value === 'all' || p.category === cat.value)
)

function add() {
  content.projects.unshift({
    id: Date.now(),
    category: cat.value === 'wordpress' ? 'wordpress' : 'code',
    featured: false,
    image: '',
    link: '',
    title: {fa: '', en: ''},
    desc: {fa: '', en: ''},
    tech: [],
  })
}

function remove(p) {
  if (!confirm('حذف شود؟')) return
  const i = content.projects.findIndex((x) => x.id === p.id)
  content.projects.splice(i, 1)
}

function setTech(p, value) {
  p.tech = value.split(',').map((s) => s.trim()).filter(Boolean)
}

function onImage(e, p) {
  const file = e.target.files[0]
  if (!file) return
  const img = new Image()
  img.onload = async () => {
    const scale = Math.min(1, 900 / img.width)
    const canvas = document.createElement('canvas')
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    try {
      p.image = await uploadImage(canvas.toDataURL('image/webp', 0.8))
    } catch {
      alert('آپلود تصویر ناموفق بود.')
    }
    URL.revokeObjectURL(img.src)
  }
  img.src = URL.createObjectURL(file)
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-3">
      <button
          v-for="c in [['all', 'همه'], ['code', 'برنامه‌نویسی'], ['wordpress', 'وردپرس']]"
          :key="c[0]"
          class="border px-4 py-2"
          :class="cat === c[0] ? 'border-accent text-ink' : 'border-muted/40'"
          @click="cat = c[0]"
      >
        {{ c[1] }}
      </button>
      <button class="btn ms-auto" @click="add">+ نمونه‌کار جدید</button>
    </div>

    <div class="mt-6 space-y-6">
      <div v-for="p in list" :key="p.id" class="border border-muted/40 p-4">
        <div class="flex flex-wrap items-center gap-4">
          <select v-model="p.category" class="field !w-auto">
            <option value="code" class="bg-bg">برنامه‌نویسی</option>
            <option value="wordpress" class="bg-bg">وردپرس</option>
          </select>
          <label class="flex cursor-pointer items-center gap-2">
            <input v-model="p.featured" type="checkbox" class="accent-[#c778dd]"/>
            نمایش در صفحه اصلی
          </label>
          <button class="btn ms-auto" @click="remove(p)">حذف</button>
        </div>

        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <input v-model="p.title.fa" dir="rtl" class="field" placeholder="عنوان (فارسی)"/>
          <input v-model="p.title.en" dir="ltr" class="field" placeholder="Title (English)"/>
          <textarea v-model="p.desc.fa" dir="rtl" rows="3" class="field" placeholder="توضیح (فارسی)"></textarea>
          <textarea v-model="p.desc.en" dir="ltr" rows="3" class="field" placeholder="Description (English)"></textarea>
          <input
              :value="p.tech.join(', ')"
              dir="ltr"
              class="field"
              placeholder="Django, Python, Tailwind"
              @change="setTech(p, $event.target.value)"
          />
          <input v-model="p.link" dir="ltr" class="field" placeholder="https://..."/>
        </div>

        <div class="mt-4 flex items-center gap-4">
          <img v-if="p.image" :src="p.image" class="h-20 w-32 object-cover"/>
          <label class="btn cursor-pointer">
            انتخاب تصویر
            <input type="file" accept="image/*" class="hidden" @change="onImage($event, p)"/>
          </label>
          <button v-if="p.image" class="btn" @click="p.image = ''">حذف تصویر</button>
        </div>
      </div>
    </div>
  </div>
</template>