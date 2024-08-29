<template>
    <div class="message-content-my" v-if="data.sendUserId === useLogin.loginUser.id ">
        <div :class="['content-panel', data.messageType == 5 ? 'content-panel-media' : '']">
            <div class="sending" v-if="data.status ==0">
                <el-skeleton :animated="true">
                    <template #template>
                        <el-skeleton-item class="skeleton-item" variant="image"/>
                    </template>
                </el-skeleton>
            </div>
            <template v-else>
                <div class="content" v-html="data.messageContent" v-if="data.messageType != 5"></div>
                <div class="content" v-else>
                    <template v-if="data.fileType == 0">
                        <ChatMessageImage :data="data" :show-detail="true"></ChatMessageImage>
                    </template>
                    <template v-if="data.fileType == 1">
                        <ChatMessageVideo :data="data"></ChatMessageVideo>
                    </template>
                    <template v-if="data.fileType == 2">
                        <ChatMessageFile :data="data"></ChatMessageFile>
                    </template>
                </div>
            </template>
        </div>
        <Avatar :width="35" :avatar="useLogin.loginUser.userAvatar" :userId="useLogin.loginUser.id"></Avatar>
    </div>
    <div class="message-content-other" v-else>
        <div class="user-avatar">
            <Avatar :width="35" :avatar="currentChatSession.avatar" :user-id="currentChatSession.contactId"></Avatar>
        </div>
        <div :class="['content-panel',data.messageType == 5 ? 'content-panel-media' : '',data.messageType == 5 ? 'group-content' : '']">
            <div class="nick-name" v-if="data.contactType == 1">
                {{ data.sendUserName }}
            </div>
            <div class="sending" v-if="data.status == 0">
                <el-skeleton :animated="true">
                    <template #template>
                        <el-skeleton-item class="skeleton-item" variant="image"/>
                    </template>
                </el-skeleton>
            </div>
            <template v-else>
                <div class="content" v-html="data.messageContent" v-if="data.messageType != 5"></div>
                <div class="content" v-else>
                    <template v-if="data.fileType == 0">
                        <ChatMessageImage :data="data" :show-detail="true"></ChatMessageImage>
                    </template>
                    <template v-if="data.fileType == 1">
                        <ChatMessageVideo :data="data"></ChatMessageVideo>
                    </template>
                    <template v-if="data.fileType == 2">
                        <ChatMessageFile :data="data"></ChatMessageFile>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">

import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import {getCurrentInstance} from "vue";
import Avatar from "@/components/Avatar.vue";
import ChatMessageImage from "@/views/chat/ChatMessageImage.vue";
import ChatMessageVideo from "@/views/chat/ChatMessageVideo.vue";
import ChatMessageFile from "@/views/chat/ChatMessageFile.vue";

const {proxy} = getCurrentInstance()
const useLogin = useLoginUserStore()
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    },
    currentChatSession: {
        type: Object,
        default: () => {
            return {}
        }
    }
})


</script>

<style lang="scss" scoped>

.sending {
  width: 170px;
  height: 170px;
  overflow: hidden;
  float: right;
  margin-right: 5px;
  border-radius: 5px;

  .skeleton-item {
    width: 170px;
    height: 170px;
  }
}

.content {
  display: inline-block;
  padding: 8px;
  color: #474747;
  border-radius: 5px;
  text-align: left;
  font-size: 14px;

  :deep(.emoji) {
    font-size: 20px;
  }
}


.content-panel {
  flex: 1;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 10px;
    height: 10px;
    background: #95ec69;
    transform: rotate(45deg);
    border-radius: 1px;
    top: 13px
  }
}


.content-panel-media {
  .content {
    border-radius: 5px;
    background: none !important;
    overflow: hidden;
    padding: 0;
  }

  &::after {
    display: none;
  }
}

.message-content-my {
  display: flex;
  float: right;
  width: 100%;
  margin-bottom: 15px;

  .content-panel {
    margin-right: 10px;
    text-align: right;

    .content {
      background: #95ec69;
      position: relative
    }

    &::after {
      right: -4px;
    }
  }
}


.message-content-other {
  display: flex;
  padding-right: 32%;
  width: 100%;
  margin-bottom: 15px;


  .user-avatar {
    margin-right: 10px;
    width: 35px;
    height: 35px;
  }

  .content-panel {
    flex: 1;
    position: relative;
    text-align: left;

    .nick-name {
      font-size: 12px;
      color: #b2b2b2;
    }

    .content {
      background: #fff;
    }

    .sending {
      float: left;
    }

    &::after {
      left: -4px;
      background: #fff;
    }
  }

  .content-panel-media {
    justify-content: flex-start;
  }
}


.group-content {
  margin-top: -6px;

  .content {
    margin-top: 6px;
  }

  &::after {
    left: -4px;
    top: 35px;
    background: #fff;
  }
}

</style>