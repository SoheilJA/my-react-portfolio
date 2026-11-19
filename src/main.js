import {createApp} from "vue";
import '@fontsource-variable/fira-code'
import '@fontsource-variable/vazirmatn'
import './style.css'
import App from './App.vue'
import {i18n, setLang} from './i18n'
import {applyTexts} from "./data/store.js";
import {router} from './router'
import {reveal} from "./directives/reveal";

applyTexts()
setLang(i18n.global.locale.value)
createApp(App)
    .use(i18n)
    .use(router)
    .directive('reveal', reveal)
    .mount('#app')