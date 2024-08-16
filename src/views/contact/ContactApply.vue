<template>
    <content-panel
            :infinite-scroll-immediate="false"
            v-infinite-scroll="loadApply">
        <div>
            <div class="apply-item" v-for="item in applyList" :key="item.id">
                <div :class="['contact-type',item.contactType === 0 ? 'user-contact' : '']">
                    {{ item.contactType === 0 ? '用户' : '群聊' }}
                </div>
                <Avatar :width="50" :user-id="item.applyUserId"  :avatar="item.avatar"></Avatar>
                <div class="contact-info">
                    <div class="nick-name">{{ item.contactName }}</div>
                    <div class="apply-info">{{ item.applyInfo }}</div>
                </div>
                <div class="op-btn">
                    <div v-if="item.status === 0">
                        <el-dropdown placement="bottom-end" trigger="click">
                        <span class="el-drop-link">
                            <el-button type="primary" size="small">接受</el-button>
                        </span>
                            <template #dropdown>
                                <el-dropdown-item @click="dealwithApply(item.applyId,item.contactType,1)">
                                    同意
                                </el-dropdown-item>
                                <el-dropdown-item @click="dealwithApply(item.applyId,item.contactType,2)">
                                    拒绝
                                </el-dropdown-item>
                                <el-dropdown-item @click="dealwithApply(item.applyId,item.contactType,3)">
                                    拉黑
                                </el-dropdown-item>
                            </template>
                        </el-dropdown>
                    </div>
                    <div v-else class="result-name">{{ item.statusName }}</div>
                </div>
            </div>
        </div>
        <div v-if="applyList.length === 0" class="no-data">暂无新的申请</div>
    </content-panel>

</template>

<script setup lang="ts">
import ContentPanel from "@/components/ContentPanel.vue";
import {useRoute, useRouter} from "vue-router";
import {getCurrentInstance, onMounted, ref} from "vue";
import {UserContactControllerService} from "../../../generated";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import Avatar from "@/components/Avatar.vue";
import {ContactSateStore} from "@/stores/ContactStateStore";

const contactStore = ContactSateStore();
const useLogin = useLoginUserStore()
const {proxy} = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const applyList = ref([])
let current = 0;
let total = 1;
const loadApply = async () => {
    current++;
    if (current > total) {
        return;
    }
    const res = await UserContactControllerService.loadApplyAddUsingPost1({
        receiveUserId: useLogin.loginUser.id,
    })
    if (res.code !== 0) {
        return;
    }
    total = res.data.total;
    if (res.data.current === 1) {
        applyList.value = []
    }
    applyList.value = applyList.value.concat(res.data.records)
    current = res.data.current
}
const dealwithApply = (applyId: Number, contactType: number, status: number) => {
    proxy.Confirm({
        message: '确定要执行操作吗？',
        okfun: async () => {
            contactStore.setContactReload(null)
            const res = await UserContactControllerService.dealWithApplyUsingPost1({
                applyId: applyId,
                status: status
            })
            if (res.code !== 0) {
                return;
            }
            current = 0;
            applyList.value = [];
            loadApply()
            if (contactType === 0 && status === 1) {
                contactStore.setContactReload("USER")
            } else if (contactType === 1 && status === 1) {
                contactStore.setContactReload("GROUP")
            }
        }
    })
}
//todo 监听好友数量
onMounted(() => {
    loadApply()
})
</script>

<style lang="scss" scoped>
.apply-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;

  .contact-type {
    display: flex;
    justify-content: center;
    writing-mode: vertical-rl;
    vertical-align: middle;
    background: #2cb6fe;
    color: #fff;
    border-radius: 5px 0 0 5px;
    height: 50px;
  }

  .user-contact {
    background: #08bf61;
  }

  .contact-info {
    width: 260px;
    margin-left: 10px;

    .nick-name {
      color: #000000;
    }

    .apply-info {
      color: #999999;
      font-size: 12px;
      margin-top: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .op-btn {
    width: 50px;
    text-align: center;

    .result-name {
      color: #999999;
      font-size: 12px;
    }
  }
}

.no-data {
  text-align: center;
  font-size: 12px;
  color: #9d9d9d;
  line-height: 30px;
}
</style>