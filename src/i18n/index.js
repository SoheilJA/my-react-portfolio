import { createI18n } from "vue-i18n";

const saved = localStorage.getItem('lang') || 'fa'

export const i18n = createI18n({
    legacy: false,
    locale: saved,
    fallbackLocale: 'en',
    flatJson: true,
    messages: { fa: {}, en: {} }
})

export function setLang(lang) {
    i18n.global.locale.value = lang
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'

}
