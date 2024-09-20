<template>
    <div id="layout">
        <div class="left-side">
            <div class="menu-list">
                <el-col>
                    <el-menu
                            :default-active="activeIndex"
                            class="sidebar-el-menu"
                            router
                    >
                        <el-menu-item v-for="subItem in showSubRoutes" :key="subItem.path" :index="subItem.path"
                                      @click="highLight(subItem.path)">
                            <el-icon>
                                <Component :is="subItem.meta.icon">
                                </Component>
                                <Badge :count="messageStore.contactApplyCount" v-if="subItem.meta.icon === 'UserFilled'"
                                       top="-10" :left="20"></Badge>
                                <Badge :count="messageStore.chatCount" v-if="subItem.meta.icon === 'ChatDotRound'"
                                       top="-10" :left="20"></Badge>
                            </el-icon>
                        </el-menu-item>
                        <div class="user-info">
                            <el-dropdown>
                                <el-avatar :size="50" :src="loginStore.loginUser.userAvatar"></el-avatar>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="toSetting">
                                            <el-icon>
                                                <Edit/>
                                            </el-icon>
                                            <span>设置</span>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </el-menu>
                </el-col>
            </div>
        </div>
        <div class="right-container">
            <router-view v-slot="{ Component }">
                <keep-alive :include="{Chat}">
                    <component :is="Component" ref="componentRef"></component>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import {Edit} from '@element-plus/icons-vue'
import {routes} from "@/router/routes";
import checkAccess from "@/access/checkAccess";
import {computed, ref} from "vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import router from "@/router";
import Badge from "@/components/Badge.vue";
import {useMessageCountStore} from "@/stores/MessageCountStore";
import {useRoute} from "vue-router";
import chat from "@/views/chat/Chat.vue";
import Chat from "@/views/chat/Chat.vue";

const messageStore = useMessageCountStore()
const loginStore = useLoginUserStore()
const activeIndex = ref('/chat')
const route = useRoute()


const highLight = (path) => {
    activeIndex.value = path
}


const toSetting = () => {
    router.push('/setting')
}

//过滤子路由
const showSubRoutes = computed(() => {
    return showRoutes.value.flatMap(route => route.children || []);
});


const showRoutes = computed(() => {
    return routes.filter((route) => {
        if (route.meta?.hideInMenu && route.path != '/') {
            return false;
        }
        const hasAccess = checkAccess(
            loginStore.loginUser,
            route.meta?.access as string
        );
        if (route.children) {
            route.children = route.children.filter(child => !child.meta?.hideInMenu && checkAccess(loginStore.loginUser, child.meta?.access as string));
        }
        return hasAccess;
    });
});


</script>

<style lang="scss" scoped>
#layout {
  background: white;
  display: flex;
  overflow: hidden;

  .left-side {
    text-align: center;
    align-items: center;
  }


  .sidebar-el-menu {
    min-height: 100%;
    height: 100vh;
    position: relative;
  }

  //头像要居中要保持和父元素一样的宽度
  .user-info {
    width: 74px;
    bottom: 0;
    align-items: center;
    position: fixed;
  }

  .right-container {
    width: 100%;
  }
}


</style>