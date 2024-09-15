<template>
    <div class="admin-window">
        <div class="title">管理员</div>
        <div class="body-content">
            <div class="left-side">
                <div
                        :class="['menu-item',item.path == route.path ? 'active' : '']"
                        @click="menuJump(item)"
                        v-for="item in menuList"
                >
                    <div :class="['iconfont',item.icon]" :style="{background : item.iconBgColor}"></div>
                    <div class="text">{{ item.name }}</div>
                </div>
            </div>
            <div class="right-content">
                <router-view v-slot="{ Component }">
                    <component :is="Component" ref="componentRef"></component>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";

const route = useRoute()
const menuList = ref([
    {
        name: "用户管理",
        icon: "icon-user",
        path: "/admin/userList",
        iconBgColor: "#fa9d3b",
    },
    {
        name: "靓号管理",
        icon: "icon-beauty-beauty",
        path: "/admin/beautyAccount",
        iconBgColor: "#fa90b3",
    },
    {
        name: "群组管理",
        icon: "icon-group",
        path: "/admin/groupList",
        iconBgColor: "#1485ee",
    },
    {
        name: "系统设置",
        icon: "icon-setting",
        path: "/admin/sysSetting",
        iconBgColor: "#fa5151",
    },
])

const menuJump = (item: any) => {
    router.push(item.path)
}
</script>

<style lang="scss" scoped>
.admin-window {
  padding: 0;
  border: 1px solid #ddd;
  background: #ffffff;
  position: relative;
  .title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
    text-align: center;
    font-weight: bold;
  }
  .body-content {
    display: flex;
    .left-side {
      width: 200px;
      border-right: 1px solid #ddd;
      background: #e6e5e5;

      .menu-item {
        display: flex;
        align-items: center;
        padding: 10px 10px;
        position: relative;

        &:hover {
          cursor: pointer;
          background: #d6d6d7;
        }
      }

      .iconfont {
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
      }

      .text {
        flex: 1;
        color: #000000;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .active {
      background: #c4c4c4;

      &:hover {
        background: #c4c4c4;
      }
    }

    .right-content {
      flex: 1;
      padding: 10px;
    }
  }
}
</style>