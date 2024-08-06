// @ts-ignore
import LoginView from "../views/LoginView.vue";
import type {RouteRecordRaw} from "vue-router";
// @ts-ignore
import LayoutView from "@/views/LayoutView.vue";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";


// @ts-ignore
export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '首页',
        component: LayoutView,
        meta: {
            title: "xinChat",
        },
    },
    {
        path: "/user/login",
        name: "用户登录",
        component: LoginView,
        meta: {
            hideInMenu: true,
            access: ACCESS_ENUM.UnLogin,
        },
    },
    {
        path: "/user/contact",
        name: "用户联系人",
        component: LoginView,
        meta: {
            access: ACCESS_ENUM.User,
        },
    },
    {
        path: "/user/setting",
        name: "用户设置",
        component: LoginView,
        meta: {
            access: ACCESS_ENUM.User,
        },
    },

];
