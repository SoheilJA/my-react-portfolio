import {createApp} from "vue";
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/vazirmatn'
import './style.css'
import App from './App.vue'
import {i18n, setLang} from './i18n'
import {applyTexts, loadContent} from './data/store'
import {router} from './router'
import {reveal} from "./directives/reveal";
import {float} from './directives/float'

applyTexts()
await loadContent()
setLang(i18n.global.locale.value)
createApp(App)
    .use(i18n)
    .use(router)
    .directive('reveal', reveal)
    .directive('float', float)
    .mount('#app')