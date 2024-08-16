<template>
    <content-panel>
        <div class="show-info" v-if="showType == 0">
            <div class="user-info">
                <UserBaseInfo :user-info="useLogin.loginUser"></UserBaseInfo>
                <div class="more-op">
                    <el-dropdown placement="bottom-end" trigger="click">
                        <div class="el-drop-link">
                            <span class="iconfont icon-more"></span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-item @click="changePart(1)">修改个人信息</el-dropdown-item>
                            <el-dropdown-item @click="changePart(2)">修改密码</el-dropdown-item>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="part-item">
                <div class="part-title">朋友权限</div>
                <div class="part-content">
                    {{ useLogin.loginUser.joinType == 0 ? '直接加入' : '加我为好友时需要验证' }}
                </div>
            </div>
            <div class="part-item">
                <div class="part-title">个性签名</div>
                <div class="part-content">{{ useLogin.loginUser.userProfile || '-' }}</div>
            </div>
            <div class="logout">
                <el-button @click="useLogin.logout()">退出登录</el-button>
            </div>
        </div>
        <div v-if="showType == 1">
            <UserInfoEdit :data="useLogin.loginUser" @emitBack="emitBack"></UserInfoEdit>
        </div>
        <div v-if="showType == 2">
            <UserInfoPassword @emitBack="emitBack"></UserInfoPassword>
        </div>
    </content-panel>
</template>

<script setup lang="ts">
import ContentPanel from "@/components/ContentPanel.vue";
import {useRoute, useRouter} from "vue-router";
import {ContactSateStore} from "@/stores/ContactStateStore";
import {getCurrentInstance, ref} from "vue";
import UserBaseInfo from "@/components/UserBaseInfo.vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import UserInfoEdit from "@/views/Setting/UserInfoEdit.vue";
import UserInfoPassword from "@/views/Setting/UserInfoPassword.vue";

const useLogin = useLoginUserStore()
const contactStore = ContactSateStore();
const {proxy} = getCurrentInstance()

const router = useRouter()
const route = useRoute()

const showType = ref(0)
const changePart = (part: number) => {
    showType.value = part;
}
const emitBack = () => {
    showType.value = 0;

}


</script>

<style scoped>
.show-info {
    .user-info {
        position: relative;
    }

    .more-op {
        position: absolute;
        right: 0;
        top: 20px;

        .icon-more {
            color: #9e9e9e;

            &:hover {
                color: #dddddd;
            }
        }
    }

    .part-item {
        display: flex;
        border-bottom: 1px solid #eaeaea;
        margin-top: 25px;

        .part-title {
            width: 60px;
            color: #9e9e9e;
        }

        .part-content {
            flex: 1;
            margin-left: 15px;
            color: #161616;
        }
    }

    .logout {
        text-align: center;
        margin-top: 20px;
    }
}


</style>