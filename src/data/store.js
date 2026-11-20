import { reactive } from 'vue'
import defaults from './content.json'
import { i18n } from '../i18n'

export const content = reactive(structuredClone(defaults))

function merge(saved) {
    Object.keys(content).forEach((k) => delete content[k])
    Object.assign(content, structuredClone(defaults), saved || {}, {
        texts: { ...defaults.texts, ...(saved?.texts || {}) },
    })
}

export function applyTexts() {
    const fa = {}
    const en = {}
    for (const [key, val] of Object.entries(content.texts)) {
        fa[key] = val.fa
        en[key] = val.en
    }
    i18n.global.setLocaleMessage('fa', fa)
    i18n.global.setLocaleMessage('en', en)
}

export async function loadContent() {
    try {
        const res = await fetch('/api/content')
        const saved = res.ok ? await res.json() : null
        if (saved) merge(saved)
    } catch {
        // اگه API در دسترس نبود، همون داده‌ی پیش‌فرض می‌مونه
    }
    applyTexts()
}

function authHeaders() {
    return { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
}

export async function saveContent() {
    const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(content),
    })
    if (!res.ok) throw new Error('save failed')
    applyTexts()
}

export async function uploadImage(dataUrl) {
    const [head, data] = dataUrl.split(',')
    const mime = head.match(/:(.*?);/)[1]
    const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ data, mime }),
    })
    if (!res.ok) throw new Error('upload failed')
    return (await res.json()).url
}

export function exportContent() {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
        type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'content.json'
    a.click()
    URL.revokeObjectURL(a.href)
}

export async function importContent(obj) {
    merge(obj)
    await saveContent()
}

export async function resetContent() {
    merge(null)
    await saveContent()
}