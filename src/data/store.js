import {reactive} from 'vue'
import defaults from './content.json'
import {i18n} from '../i18n'

const saved = JSON.parse(localStorage.getItem('content') || 'null')
export const content = reactive(
    saved
        ? {
            ...structuredClone(defaults),
            ...saved,
            texts: {...defaults.texts, ...saved.texts},
        }
        : structuredClone(defaults)
)

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

export function saveContent() {
    try {
        localStorage.setItem('content', JSON.stringify(content))
    } catch {
        alert('حافظه‌ی مرورگر پر شد. از تصاویر کوچک‌تر استفاده کن.')
    }
    applyTexts()
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

export function importContent(obj) {
    Object.keys(content).forEach((k) => delete content[k])
    Object.assign(content, obj)
    saveContent()
}

export function resetContent() {
    localStorage.removeItem('content')
    Object.keys(content).forEach((k) => delete content[k])
    Object.assign(content, structuredClone(defaults))
    applyTexts()
}
