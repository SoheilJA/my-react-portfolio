import { reactive } from 'vue'
import defaults from './content.json'
import { i18n } from '../i18n'

const saved = localStorage.getItem('content')
export const content = reactive(
    saved ? JSON.parse(saved) : structuredClone(defaults)
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
    localStorage.setItem('content', JSON.stringify(content))
    applyTexts()
}