import { ref } from 'vue'
import { content, saveContent } from '../data/store'

export const saveState = ref('idle')

let timer
let lastJson = JSON.stringify(content)

export function scheduleSave(ms = 900) {
  if (JSON.stringify(content) === lastJson) return
  saveState.value = 'dirty'
  clearTimeout(timer)
  timer = setTimeout(() => saveNow(), ms)
}

export async function saveNow(force = false) {
  clearTimeout(timer)
  const json = JSON.stringify(content)
  if (!force && json === lastJson) {
    if (saveState.value !== 'error') saveState.value = 'saved'
    return true
  }
  saveState.value = 'saving'
  try {
    await saveContent()
    lastJson = json
    saveState.value = 'saved'
    return true
  } catch {
    saveState.value = 'error'
    return false
  }
}