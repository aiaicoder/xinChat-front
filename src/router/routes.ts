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
                    },
                    {
                        path: "/contact/contactNotice",
                        name: "新的朋友",
                        // @ts-ignore
                        component: () => import("@/views/contact/ContactApply.vue"),
                    }


                ],
                meta: {
                    icon: "UserFilled",
                    access: ACCESS_ENUM.User,
                },
            },
            {
                path: "/setting",
                name: "用户信息",
                redirect:"/setting/userInfo",
                // @ts-ignore
                component: () => import("@/views/Setting/Setting.vue"),
                children:[
                    {
                        path: "/setting/userInfo",
                        name: "用户设置",
                        // @ts-ignore
                        component: () => import("@/views/Setting/UserInfo.vue"),
                    },
                    {
                        path: "/setting/about",
                        name: "关于",
                        // @ts-ignore
                        component: () => import("@/views/Setting/About.vue"),
                    }
                ],
                meta: {
                    hideInMenu: true,
                    access: ACCESS_ENUM.User,
                },
            },
            {
                path: "/Admin",
                name: "管理员",
                redirect:"/admin/userList",
                // @ts-ignore
                component: () => import("@/views/Admin/Admin.vue"),
                children:[
                    {
                        path: "/admin/userList",
                        name: "用户管理",
                        // @ts-ignore
                        component: () => import("@/views/Admin/UserList.vue"),
                    },
                    {
                        path: "/admin/groupList",
                        name: "群组管理",
                        // @ts-ignore
                        component: () => import("@/views/Admin/GroupList.vue"),
                    },
                    {
                        path: "/admin/sysSetting",
                        name: "系统设置",
                        // @ts-ignore
                        component: () => import("@/views/Admin/SysSetting.vue"),
                    },
                    {
                        path: "/admin/beautyAccount",
                        name: "靓号管理",
                        // @ts-ignore
                        component: () => import("@/views/Admin/BeautyAccount.vue"),
                    },
                ],
                meta: {
                    access: ACCESS_ENUM.Admin,
                    icon: "Operation",
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
