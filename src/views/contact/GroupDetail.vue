<template>
    <ContentPanel>
        <div class="group-info-item">
            <div class="group-title">群封面：</div>
            <div class="group-value">
                <Avatar :user-id="groupInfo.groupId"></Avatar>
            </div>
            <div class="more-op">
                <el-dropdown placement="bottom-end" trigger="click">
                    <span class="el-dropdown-link">
                        <div class="iconfont icon-more"></div>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu v-if="groupInfo.groupOwnerId == loginUse.loginUser.id">
                            <el-dropdown-item @click="editGroupInfo">修改群信息</el-dropdown-item>
                            <el-dropdown-item @click="dissolutionGroup">解散该群</el-dropdown-item>
                        </el-dropdown-menu>
                        <el-dropdown-menu v-else>
                            <el-dropdown-item @click="leaveGroup">退出该群</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="group-info-item">
            <div class="group-title">群ID：</div>
            <div class="group-value">{{ groupInfo.groupId }}</div>
        </div>
        <div class="group-info-item">
            <div class="group-title">群名称：</div>
            <div class="group-value">{{ groupInfo.groupName }}</div>
        </div>
        <div class="group-info-item">
            <div class="group-title">群成员：</div>
            <div class="group-value">{{ groupInfo.memberCount }}</div>
        </div>
        <div class="group-info-item">
            <div class="group-title">加入权限：</div>
            <div class="group-value">{{ groupInfo.joinType == 0 ? "直接加入" : "管理员同意后加入" }}</div>
        </div>
        <div class="group-info-item notice">
            <div class="group-title">群公告：</div>
            <div class="group-value">{{ groupInfo.groupNotice || '-' }}</div>
        </div>
        <div class="group-info-item">
            <div class="group-title"></div>
            <div class="group-value">
                <el-button type="primary" @click="sendMessage">发送群消息</el-button>
            </div>
        </div>
    </ContentPanel>
    <GroupEditDialog ref="groupEditDialogRef" @reloadGroupInfo="getGroupInfo"></GroupEditDialog>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ContactSateStore} from "@/stores/ContactStateStore";
import {getCurrentInstance, ref, watch} from "vue";
import {GroupInfoControllerService} from "../../../generated";
import {ElMessage} from "element-plus";
import ContentPanel from "@/components/ContentPanel.vue";
import Avatar from "@/components/Avatar.vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import GroupEditDialog from "@/views/contact/GroupEditDialog.vue";

const loginUse = useLoginUserStore()
const contactStore = ContactSateStore();
const {proxy} = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const groupInfo = ref({})
const groupId = ref()

const groupEditDialogRef = ref()
//修改群聊信息
const editGroupInfo = () => {
    groupEditDialogRef.value.show(groupInfo.value)
}

//解散群聊
const dissolutionGroup = () => {
    proxy.Confirm({
        message: "确定解散该群吗？删除后将无法恢复!",
        okfun: async () => {
            contactStore.setContactReload(null)
            const res = await GroupInfoControllerService.dismissGroupUsingPost1(groupInfo.value.groupId)
            if (res.code === 0) {
                ElMessage.success("解散成功")
            } else {
                ElMessage.error(res.message)
            }
            //刷新群聊列表
            contactStore.setContactReload("DISSOLUTION_GROUP")
        }
    })
}

//退出群聊
const leaveGroup = () => {
    proxy.Confirm({
        message: "确定退出群组?",
        okfun: async () => {
            contactStore.setContactReload(null)
            const res = await GroupInfoControllerService.leaveGroupUsingPost1(groupInfo.value.groupId)
            if (res.code === 0) {
                ElMessage.success("退出成功")
            } else {
                ElMessage.error(res.message)
            }
            //刷新群聊列表
            contactStore.setContactReload("LEAVE_GROUP")
        }
    })
}

//发送消息
const sendMessage = () => {
    router.push({
        name: "/chat",
        query: {
            chatId: groupInfo.value.groupId,
            timestamp: new Date().getTime()
        }
    })
}

//获取群聊信息
const getGroupInfo = async () => {
    const res = await GroupInfoControllerService.getGroupInfoUsingPost1(
        {
            groupId: groupId.value
        }
    )
    if (res.code === 0) {
        groupInfo.value = res.data
    } else {
        ElMessage.error(res.message)
    }
}
//监听路由id的变化显示不同的群聊信息
watch(() => route.query.contactId, (newVal, oldVal) => {
    if (newVal) {
        groupId.value = newVal
        getGroupInfo()
    }
}, {
    immediate: true,
    deep: true
})
</script>

<style scoped>
.group-info-item {
    display: flex;
    margin: 15px 0;
    align-items: center;

    .group-title {
        width: 100px;
        text-align: right;
    }

    .group-value {
        flex: 1;
    }
}

.notice {
    align-items: flex-start;
}
</style>