import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AdminPage from '../pages/AdminPage.vue'
import { setLang } from '../i18n'

const titles = {
    fa: 'سهیل جلال‌احمدی | طراح و توسعه‌دهنده وب',
    en: 'Soheil Jalal Ahmadi | Web Developer & Designer',
}

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/fa' },
        { path: '/:lang(fa|en)', component: HomePage },
        { path: '/admin', component: AdminPage, meta: { skipLoader: true } },
        {
            path: '/panel',
            component: () => import('../admin/AdminRoot.vue'),
            meta: { admin: true, skipLoader: true },
            children: [
                { path: 'login', component: () => import('../admin/LoginPage.vue') },
                {
                    path: '',
                    component: () => import('../admin/AdminLayout.vue'),
                    meta: { auth: true },
                    children: [
                        { path: '', component: () => import('../admin/DashboardPage.vue') },
                        { path: 'texts', component: () => import('../admin/TextsPage.vue') },
                        { path: 'services', component: () => import('../admin/ServicesPage.vue') },
                        { path: 'projects', component: () => import('../admin/ProjectsPage.vue') },
                        { path: 'skills', component: () => import('../admin/SkillsPage.vue') },
                        { path: 'certificates', component: () => import('../admin/CertificatesPage.vue') },
                        { path: 'contact', component: () => import('../admin/ContactPage.vue') },
                    ],
                },
            ],
        }, { path: '/:pathMatch(.*)*', redirect: '/fa' },
    ],
})

router.beforeEach((to) => {
    if (to.params.lang) setLang(to.params.lang)
    if (to.meta.auth && !sessionStorage.getItem('token')) return '/panel/login'
})

router.afterEach((to) => {
    const lang = to.params.lang
    if (!lang) return
    document.title = titles[lang]
    const canonical = document.getElementById('canonical')
    if (canonical) canonical.href = `https://soheil-ja.ir/${lang}`
})