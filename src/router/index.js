import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AdminPage from '../pages/AdminPage.vue'
import {setLang} from '../i18n'

const titles = {
    fa: 'سهیل جلال‌احمدی | طراح و توسعه‌دهنده وب',
    en: 'Soheil Jalal Ahmadi | Web Developer & Designer',
}

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', redirect: '/fa'},
        {path: '/:lang(fa|en)', component: HomePage},
        {path: '/admin', component: AdminPage},
        {path: '/:pathMatch(.*)*', redirect: '/fa'},
    ],
})

router.beforeEach((to) => {
    if (to.params.lang) setLang(to.params.lang)
})

router.afterEach((to) => {
    const lang = to.params.lang
    if (!lang) return
    document.title = titles[lang]
    const canonical = document.getElementById('canonical')
    if (canonical) canonical.href = `https://soheil-ja.ir/${lang}`
})