import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../pages/HomePage.vue'
import AdminPage from '../pages/AdminPage.vue'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomePage },
        { path: '/admin', component: AdminPage }
    ],
})