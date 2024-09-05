<template>
    <chat-message-time :data="data"></chat-message-time>
    <div class="sys-message">
        {{ dataMessage.messageContent }}
    </div>
</template>

<script setup lang="ts">
import ChatMessageTime from "@/views/chat/ChatMessageTime.vue";
import {computed} from "vue";

const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const dataMessage = computed(() => {
    const data = {...props.data}
    if (data.messageType === 1) {
        data.messageContent = "已经添加为好友，以下是打招呼消息"
    }
    return data
})

</script>

<style lang="scss" scoped>
.sys-message {
  text-align: center;
  font-size: 12px;
  color: #999999;
  margin-bottom: 20px;
}
</style>