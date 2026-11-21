import { createApp } from "vue";
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/vazirmatn'
import './style.css'
import App from './App.vue'
import { i18n, setLang } from './i18n'
import { applyTexts, loadContent } from './data/store'
import { router } from './router'
import { reveal } from "./directives/reveal";
import { float } from './directives/float'
import { magnetic } from './directives/magnetic'
import { initScroll } from './lib/scroll'

applyTexts()
await loadContent()
initScroll()
setLang(i18n.global.locale.value)
const app = createApp(App)

router.beforeEach(async (to) => {
    if (to.meta.admin && !app.config.globalProperties.$primevue) {
        const { setupPrimeVue } = await import('./admin/setup.js')
        setupPrimeVue(app)
    }
})

app
    .use(i18n)
    .use(router)
    .directive('reveal', reveal)
    .directive('float', float)
    .directive('magnetic', magnetic)
    .mount('#app')