import {createRouter, createWebHistory} from 'vue-router'
// @ts-ignore
import {routes} from "@/router/routes";


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
