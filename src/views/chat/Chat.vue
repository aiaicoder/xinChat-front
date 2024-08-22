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
                    <ChatSession :data="item" @click="ChatSessionClickHandle(item)"
                                 @contextmenu.stop="oncontextmenu(item,$event)"></ChatSession>
                </template>
            </div>
        </template>
        <template #right-content>
            <div class="title-panel" v-if="Object.keys(currentChatSession).length > 0">
                <div class="title">
                    <span>{{ currentChatSession.contactName }}</span>
                    <span v-if="currentChatSession.contactType == 1">
                        ({{ currentChatSession.memberCount }})
                    </span>
                </div>
            </div>
            <div v-if="currentChatSession.contactType ==1" class="iconfont icon-more" @click="showGroupDetail">

            </div>
            <div class="chat-panel" v-show="Object.keys(currentChatSession).length > 0">
                <div class="message-panel">
                    <div class="message-item" v-for="(data,index) in messageList" :id="'message' + data.messageId"
                         :key="index">
                        {{ data.messageContent }}
                    </div>
                </div>
                <MessageSend :currentChatSession="currentChatSession" @reloadMsg="reloadMsg"></MessageSend>
            </div>
        </template>
    </layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
import {getCurrentInstance, onBeforeMount, onMounted, ref} from "vue";
import ChatSessionModel from "@/db/ChatSessionModel";
import ChatSession from "@/views/chat/ChatSession.vue";
import ContextMenu from "@imengyu/vue3-context-menu";
import chatMessageModel from "@/db/ChatMessageModel";
import MessageSend from "@/views/chat/MessageSend.vue";
import EventBus from '../../main'

const {proxy} = getCurrentInstance()
const searchKey = ref("");
const search = () => {
}

const chatSessionList = ref([])
const onLoadSessionData = () => {
    const result = ChatSessionModel.getAllSessions()
    result.then((res) => {
        sortChatSession(res)
        chatSessionList.value = res
    })
}


//对会话进行排序
const sortChatSession = (dataList: Object[]) => {
    dataList.sort((a, b) => {
        const topTypeResult = b["topType"] - a["topType"]
        if (topTypeResult == 0) {
            return b["lastMessageTime"] - a["lastMessageTime"]
        }
        return topTypeResult
    })
}


//置顶会话
const setTop = (item) => {
    if (item.topType == 0) {
        item.topType = 1
    } else {
        item.topType = 0
    }
    ChatSessionModel.updateAll(item)
    onLoadSessionData()
}

//当前选中的会话
const currentChatSession = ref({})
const messageCountInfo = {
    pageTotal: 0,
    pageNo: 0,
    maxMessageId: null,
    nodata: false
}

//点击会话
const messageList = ref([])

const ChatSessionClickHandle = (item) => {
    currentChatSession.value = Object.assign({}, item)
    //消息记录要清空
    messageCountInfo.pageNo = 0
    messageCountInfo.pageTotal = 0;
    messageCountInfo.nodata = false
    messageCountInfo.maxMessageId = null;
    messageList.value = []
    ChatSessionModel.clearNoReadCount(currentChatSession.value.sessionId)
    localStorage.setItem("currentSessionId", currentChatSession.value.sessionId)
    loadChatMessage()
}

const loadChatMessage = () => {
    if (messageCountInfo.nodata) {
        return
    }
    messageCountInfo.pageNo++
    chatMessageModel.getChatMessage(currentChatSession.value.sessionId, messageCountInfo.pageNo, messageCountInfo.maxMessageId).then(res => {
        console.log(res, "11111")
        if (res.messageCount == res.currentPage) {
            messageCountInfo.nodata = true
        }
        res.messages.sort((a, b) => {
            console.log("aaaa")
            return a.messageId - b.messageId
        })
        //分页一点一点添加
        messageList.value = messageList.value.concat(res.messages)
        messageCountInfo.pageNo = res.currentPage;
        messageCountInfo.pageTotal = res.messageCount;
        if (res.currentPage == 1) {
            messageCountInfo.maxMessageId = res.messages.length > 0 ? res.messages[res.messages.length - 1].messageId : null
        }
    }).catch((err) => {
        console.log(err, "出错")
    })
}

const loadSendChatMessage = (messageId) => {
    if (messageCountInfo.nodata) {
        return
    }
    chatMessageModel.getMessageById(messageId).then(res => {
        console.log(res)
        //分页一点一点添加
        messageList.value = messageList.value.concat(res)
    })
}


//删除会话
const deleteChatSessionList = (contactId: String) => {
    chatSessionList.value = chatSessionList.value.filter(item => item.contactId != contactId)
}

const deleteSession = (item) => {
    deleteChatSessionList(item.contactId)
    item.status = 0;
    ChatSessionModel.updateAll(item)
    currentChatSession.value = {}
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
                    sortChatSession(chatSessionList.value)
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

//发送完消息的回调
const reloadMsg = (messageId) => {
    loadSendChatMessage(messageId)
}

onMounted(() => {
    onLoadSessionData()
    localStorage.setItem("currentSessionId", currentChatSession.value.sessionId)
    EventBus.on("reloadMessage", (messageId) => {
        console.log('接收到事件：重新加载消息')
        loadSendChatMessage(messageId)
    })
})


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
    width: 100vw;

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