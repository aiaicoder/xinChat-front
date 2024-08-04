import {createRouter, createWebHistory} from 'vue-router'
// @ts-ignore
import LoginView from "@/views/LoginView.vue";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: '用户登录',
            component: LoginView
        },
    ]
})

export default router
