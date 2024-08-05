import {createRouter, createWebHistory} from 'vue-router'
// @ts-ignore
import LoginView from "@/views/LoginView.vue";
import {routes} from "@/router/routes";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
