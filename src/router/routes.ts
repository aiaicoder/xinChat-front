import type {RouteRecordRaw} from "vue-router";
// @ts-ignore
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
// @ts-ignore
import GroupEdite1 from "@/views/contact/GroupEdite1.vue";
// @ts-ignore
import GroupEdit from "@/views/contact/GroupEdit.vue";


export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '首页',
        // @ts-ignore
        component: () => import("@/views/LayoutView.vue"),
        redirect: "/chat",
        children: [
            {
                path: "/chat",
                name: "聊天页面",
                // @ts-ignore
                component: () => import("@/views/chat/Chat.vue"),
                meta: {
                    access: ACCESS_ENUM.User,
                    icon: "ChatDotRound",
                },
            },
            {
                path: "/contact",
                name: "联系人",
                // @ts-ignore
                component: () => import("@/views/contact/UserContact.vue"),
                redirect: "/contact/blank",
                children: [
                    {
                        path: "/contact/blank",
                        name: "空白页",
                        // @ts-ignore
                        component: () => import("@/views/contact/BlankPage.vue"),
                    },
                    {
                        path: "/contact/search",
                        name: "搜索",
                        // @ts-ignore
                        component: () => import("@/views/contact/Search.vue"),
                    },
                    {
                        path: "/contact/createGroup",
                        name: "新建群聊",
                        // @ts-ignore
                        component: () => import("@/views/contact/GroupEdit.vue"),
                    },
                    {
                        path: "/contact/userDetail",
                        name: "用户详情",
                        // @ts-ignore
                        component: () => import("@/views/contact/UserDetail.vue"),
                    },
                    {
                        path: "/contact/GroupDetail",
                        name: "群聊详情",
                        // @ts-ignore
                        component: () => import("@/views/contact/GroupDetail.vue"),
                    }

                ],
                meta: {
                    icon: "UserFilled",
                    access: ACCESS_ENUM.User,
                },
            },
            {
                path: "/Regulate",
                name: "管理",
                // @ts-ignore
                component: () => import("@/views/regulate/Regulate.vue"),
                meta: {
                    access: ACCESS_ENUM.Admin,
                    icon: "Operation",
                },
            },
            {
                path: "/userInfo",
                name: "用户信息",
                // @ts-ignore
                component: () => import("@/views/userInfo/UserCenter.vue"),
                meta: {
                    hideInMenu: true,
                    access: ACCESS_ENUM.User,
                },
            },
        ],
        meta: {
            title: "xinChat",
            hideInMenu: true,
            access: ACCESS_ENUM.User,
        },

    },
    {
        path: "/user/login",
        name: "用户登录",
        // @ts-ignore
        component: () => import("@/views/LoginView.vue"),
        meta: {
            hideInMenu: true,
            access: ACCESS_ENUM.UnLogin,
        },
    },



];
