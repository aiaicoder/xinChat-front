<template>
    <div>
        <AvatarBase
                :avatar="avatar"
                :width="width"
                :border-radius="borderRadius"
                :show-detail="showDetail"
                v-if="userId == 'Urobot'"
        >
        </AvatarBase>
        <el-popover
                v-else
                :width="280"
                :visible="showUserInfo"
                placement="right-start"
                :show-arrow="false"
                transition="none"
                trigger="click"
                @hide="closePopover"
                @show="getContactInfo"
                ref="popoverRef"
        >
            <template #reference>
                <AvatarBase
                        :avatar="avatar"
                        :width="width"
                        :border-radius="borderRadius"
                        :show-detail="false"
                        @click="showUserInfoPopoverHandler"
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
        <SearchAdd ref="searchAddRef"></SearchAdd>
    </div>
</template>

<script setup lang="ts">
import AvatarBase from "@/components/AvatarBase.vue";
import UserBaseInfo from "@/components/UserBaseInfo.vue";
import {ref} from "vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import {UserContactControllerService} from "../../generated";
import router from "@/router";
import SearchAdd from "@/views/contact/SearchAdd.vue";

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
    },
    avatar: {
        type: String,
        default: ''
    }
})

const userInfo = ref({})
const popoverRef = ref(null);
const showUserInfo = ref(false);
const hidePopover = () => {
    showUserInfo.value = false;
};

const showUserInfoPopoverHandler = () => {
    showUserInfo.value = !showUserInfo.value;
}

const closePopover = () => {
    document.removeEventListener('click', hidePopover, false)
}

const getContactInfo = async () => {
    userInfo.value.id = props.userId
    document.addEventListener('click', hidePopover, false)
    if (loginUse.loginUser.id == props.userId) {
        userInfo.value = loginUse.loginUser
    } else {
        if (userInfo.value.id.startsWith("G")) {
            return
        }
        const res = await UserContactControllerService.getContactInfoUsingGet(props.userId)
        if (res.code != 0) {
            return
        }
        userInfo.value = Object.assign({}, res.data)
    }
}


const emit = defineEmits(['closeDrawer'])
const sendMessage = () => {
    emit('closeDrawer')
    popoverRef.value.hide()
    router.push({
        path: "/chat",
        query: {
            chatId: props.userId,
            timestamp: new Date().getTime()
        }
    })
}

const searchAddRef = ref()
const addContact = () => {
    searchAddRef.value.show({
        contactId: props.userId,
        contactType: "USER"
    })
}

</script>

<style scoped>
.op-btn {
    text-align: center;
    border-top: 1px solid #eaeaea;
    padding-top: 10px;
}
</style>