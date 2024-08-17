<template>
    <layout>
        <template #left-content>
            <div class="drag-panel drag"></div>
            <div class="top-search">
                <el-input clearable placeholder="搜索" v-model="searchKey" size="small" @keyup="search">
                    <template #suffix>
                        <span class="iconfont icon-search"></span>
                    </template>
                </el-input>
            </div>
            <div class="chat-session-list">
                <template v-for="item in chatSessionList" :key="item.userId">
                    <ChatSession :data="item" @contextmenu.stop="oncontextmenu(item,$event)"></ChatSession>
                </template>
            </div>
        </template>
    </layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
import {getCurrentInstance, onMounted, ref, watch} from "vue";
import {useChatStore} from "@/stores/UseChatStore";
import ChatSessionModel from "@/db/ChatSessionModel";
import ChatSession from "@/views/chat/ChatSession.vue";
import ContextMenu from "@imengyu/vue3-context-menu";

const {proxy} = getCurrentInstance()
const searchKey = ref("");
const search = () => {
}
const useChat = useChatStore()
const chatSessionList = ref([])
const onLoadSessionData = () => {
    const result = ChatSessionModel.getAllSessions()
    result.then((res) => {
        chatSessionList.value = res
        console.log("chatSessionList", chatSessionList.value)
    })
}
onMounted(() => {
    onLoadSessionData()
})

const setTop = (item) => {
    if (item.topType == 0) {
        item.topType = 1
    } else {
        item.topType = 0
    }
    ChatSessionModel.update(item)
    onLoadSessionData()
}
const deleteSession = (item) => {
    item.status = 0;
    ChatSessionModel.update(item)
    onLoadSessionData()
}
//右键
const oncontextmenu = (item, e) => {
    e.preventDefault(); // 阻止浏览器的默认行为
    e.stopPropagation(); // 阻止冒泡
    ContextMenu.showContextMenu({
        x: e.x,
        y: e.y,
        items: [
            {
                label: item.topType == 0 ? '置顶' : '取消置顶',
                onClick: () => {
                    setTop(item)
                }
            },
            {
                label: '删除聊天',
                onClick: () => {
                    proxy.Confirm(
                        {
                            message: `确定删除该聊天【${item.contactName}】吗？`,
                            okfun: () => {
                                deleteSession(item)
                            }
                        }
                    )
                }
            },
        ]
    })
}
// watch(useChat.messageType, (newVal, oldVal) =>{
//     console.log(oldVal,"监听消息状态")
//     if (newVal == 0){
//         onLoadSessionData()
//         console.log("chatSessionList", chatSessionList.value)
//     }
// },{
//     deep: true,
//     immediate: true
// })
</script>

<style scoped>
.drag-panel {
    height: 25px;
    background: #F7F7F7;
}

.top-search {
    padding: 0 10px 9px 10px;
    background: #F7F7F7;
    display: flex;
    align-items: center;

    .iconfont {
        font-size: 12px;
    }
}

.chat-session-list {
    border-top: 1px solid #ddd;
    height: calc(100vh - 70px);
    overflow: hidden;

    &:hover {
        overflow: auto;
    }
}

.search-list {
    border-top: 1px solid #ddd;
    height: calc(100vh - 70px);
    overflow: hidden;

    &:hover {
        overflow: auto;
    }
}

.title-panel {
    display: flex;
    align-items: center;

    .title {
        height: 60px;
        line-height: 60px;
        padding-left: 10px;
        font-size: 18px;
        color: #000000;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.icon-more {
    position: absolute;
    z-index: 1;
    top: 30px;
    right: 30px;
    width: 20px;
    font-size: 20px;
    margin-right: 5px;
    cursor: pointer;
}

.chat-panel {
    border-top: 1px solid #ddd;
    background: #f5f5f5;

    .message-panel {
        padding: 10px 30px 0 30px;
        height: calc(100vh - 200px - 70px);
        overflow-y: auto;

        .message-item {
            margin-bottom: 15px;
            text-align: center;
        }
    }
}
</style>