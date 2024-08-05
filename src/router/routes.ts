// @ts-ignore
import LoginView from "../views/LoginView.vue";
import type {RouteRecordRaw} from "vue-router";
// @ts-ignore
import LayoutView from "@/views/LayoutView.vue";


export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '首页',
        component: LayoutView
    },
    {
        path: '/login',
        name: '用户登录',
        component: LoginView
    },
];
