<template>
    <ContentPanel>
        <div class="user-info">
            <user-base-info :user-info="userInfo"></user-base-info>
            <div class="more-op">
                <el-dropdown placement="bottom-end" trigger="click">
                    <span class="el-dropdown-link">
                        <div class="iconfont icon-more"></div>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="addContactToBlackList">加入黑名单</el-dropdown-item>
                            <el-dropdown-item @click="delContact">删除联系人</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="part-item">
            <div class="part-title">个性签名</div>
            <div class="part-content">{{ userInfo.userProfile || '-' }}</div>
        </div>
        <div class="send-message" @click="sendMessage">
            <div class="iconfont icon-chat2"></div>
            <div class="text">发消息</div>
        </div>
    </ContentPanel>
</template>

<script setup lang="ts">
import ContentPanel from "@/components/ContentPanel.vue";
import UserBaseInfo from "@/components/UserBaseInfo.vue";
import {getCurrentInstance, ref, watch} from "vue";
import {UserContactControllerService} from "../../../generated";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import {ContactSateStore} from "@/stores/ContactStateStore";


const contactStore = ContactSateStore();
const {proxy} = getCurrentInstance()
const userInfo = ref({})
const router = useRouter()
const route = useRoute()
const loadUserInfo = async (contactId: string) => {
    const res = await UserContactControllerService.getContactUserInfoUsingGet(contactId)
    if (res.code === 0) {
        userInfo.value = res.data
    } else {
        ElMessage.error(res.message)
    }
}

//加入黑名单
const addContactToBlackList = async () => {
    proxy.Confirm({
        message: "确认要将用户加入黑名单吗？该过程不可逆",
        okfun: async () => {
            const res = await UserContactControllerService.blackContactUsingPost({
                contactId: userInfo.value.id
            })
            if (res.code === 0) {
                ElMessage({
                    message: "加入黑名单成功",
                    type: "success",
                })
            } else {
                ElMessage.error(res.message)
            }
            delContactData()
        }
    })
}
//删除用户
const delContact = async () => {
    proxy.Confirm({
        message: "确认要删除该联系人吗？",
        okfun: async () => {
            const res = await UserContactControllerService.delContactUsingPost({
                contactId: userInfo.value.id
            })
            if (res.code === 0) {
                ElMessage({
                    message: "删除成功",
                    type: "success",
                })
            } else {
                ElMessage.error(res.message)
            }
            delContactData()
        }
    })
}
const delContactData = () => {
    contactStore.setContactReload("REMOVE_USER")
}

const sendMessage = () => {
    router.push({
        path: "/chat",
        query: {
            chatId: userInfo.value.id,
            timestamp: new Date().getTime()
        }
    })
}
watch(() => route.query.contactId, (newVal, oldVal) => {
    if (newVal) {
        loadUserInfo(newVal as string)
    }
}, {
    immediate: true,
    deep: true
})
</script>

<style scoped>
.user-info {
    position: relative;

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
}

.part-item {
    display: flex;
    border-bottom: 1px solid #eaeaea;
    padding: 20px 0;

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

.send-message {
    width: 80px;
    margin: 0 auto;
    text-align: center;
    margin-top: 20px;
    color: #7d8cac;
    padding: 5px;

    .icon-chat2 {
        font-size: 23px;
    }

    .text {
        font-size: 12px;
        margin-top: 5px;
    }

    &:hover {
        background: #e6e6e6;
        cursor: pointer;
    }
}

</style>