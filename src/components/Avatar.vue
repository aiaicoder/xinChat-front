<template>
    <div>
        <AvatarBase
                :user-id="userId"
                :width="width"
                :border-radius="borderRadius"
                :show-detail="showDetail"
                v-if="userId == 'Urobot'"
        >
        </AvatarBase>
        <el-popover
                v-else
                :width="280"
                placement="right-start"
                :show-arrow="false"
                transition="none"
                :hide-after="0"
                @show="getContactInfo"
                ref="popoverRef"
        >
            <template #reference>
                <AvatarBase
                        :user-id="userId"
                        :width="width"
                        :border-radius="borderRadius"
                        :show-detail="false"
                >
                </AvatarBase>
            </template>
            <template #default>
                <UserBaseInfo :user-info="userInfo"></UserBaseInfo>
                <div class="op-btn" v-if="userId != loginUse.loginUser.id">
                    <el-button v-if="userInfo.contactStatus == 1" type="primary" @click="sendMessage">发送消息
                    </el-button>
                    <el-button v-else-if="userInfo" type="primary" @click="addContact">加为好友</el-button>
                </div>
            </template>
        </el-popover>
    </div>
</template>

<script setup lang="ts">
import AvatarBase from "@/components/AvatarBase.vue";
import UserBaseInfo from "@/components/UserBaseInfo.vue";
import {ref} from "vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import {UserContactControllerService} from "../../generated";

const loginUse = useLoginUserStore()
const props = defineProps({
    userId: {
        type: String,
    },
    width: {
        type: Number,
        default: 40
    },
    borderRadius: {
        type: Number,
        default: 0
    },
    showDetail: {
        type: Boolean,
        default: false
    }
})

const userInfo = ref({})
const getContactInfo = async () => {
    userInfo.value.id= props.userId
    if (loginUse.loginUser.id == props.userId) {
        userInfo.value = loginUse.loginUser
    } else {
        if (userInfo.value.id.toString().startsWith("G")){
            return
        }
        const res = await UserContactControllerService.getContactInfoUsingGet1(props.userId)
        if (res.code != 0) {
            return
        }
        userInfo.value = Object.assign({}, res.data)
    }
}
//todo 发送消息
const sendMessage = () => {
    console.log("发送消息")
}
//todo 加为好友
const addContact = () => {
    console.log("加为好友")
}
</script>

<style scoped>
.op-btn {
    text-align: center;
    border-top: 1px solid #eaeaea;
    padding-top: 10px;
}
</style>