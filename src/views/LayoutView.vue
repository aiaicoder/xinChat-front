<template>
    <div id="layout">
        <div class="left-side">
            <div></div>
            <div class="menu-list">
                <el-col>
                    <el-menu
                            :default-active="activeIndex"
                    >
                        <el-menu-item v-for="item in showRoutes" :key="item.path" :index="item.path"
                                      @click="hightlight(item.path)">
                            <el-icon v-if="item.name == '首页'">
                                <ChatDotRound/>
                            </el-icon>
                            <el-icon v-else-if="item.name == '用户联系人'">
                                <User/>
                            </el-icon>
                            <el-icon v-else-if="item.name == '用户设置'">
                                <Setting/>
                            </el-icon>
                        </el-menu-item>
                        <div class="user-info">
                            <el-avatar :size="50" :src="loginStore.loginUser.userAvatar"></el-avatar>
                            <div>{{ loginStore.loginUser.userName}}</div>
                        </div>
                    </el-menu>

                </el-col>
            </div>

        </div>
        <div class="right-container">

        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ChatDotRound,
    Setting, User,
} from '@element-plus/icons-vue'
import {routes} from "@/router/routes";
import checkAccess from "@/access/checkAccess";
import {computed, ref} from "vue";
import {useLoginUserStore} from "@/stores/useLoginUserStore";

const loginStore = useLoginUserStore()
const activeIndex = ref('/')
const hightlight = (path) => {
    activeIndex.value = path
}

const showRoutes = computed(() => {
    return routes.filter((route) => {
        if (route.meta?.hideInMenu) {
            return false;
        }
        return checkAccess(
            //如果直接通过复制拿到的值，不是响应式数据
            loginStore.loginUser,
            route.meta?.access as string
        );
    });
});

</script>

<style lang="scss" scoped>
#layout {
  background: #ddd;
  display: flex;
  overflow: hidden;
}

.left-side {
  width: 74px;
  text-align: center;
  align-items: center;
}

</style>