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
            <div class="chat-session-list" v-if="!searchKey">
                <template v-for="item in chatSessionList" :key="item.userId">
                    <ChatSession :data="item" @click="ChatSessionClickHandle(item)"
                                 @contextmenu.stop="oncontextmenu(item,$event)"
                                 :current-session="item.contactId === currentChatSession.contactId"
                    ></ChatSession>
                </template>
            </div>
            <div class="search-list" v-show="searchKey">
                <SearchResult :data="item" v-for="item in searchList" @click="searchClickHandler(item)"></SearchResult>
            </div>
        </template>
        <template #right-content>
            <div class="title-panel" v-if="Object.keys(currentChatSession).length > 0">
                <div class="title">
                    <span>{{ currentChatSession.contactName }}</span>
                    <span v-if="currentChatSession.contactType === 1">
                        ({{ currentChatSession.memberCount }})
                    </span>
                </div>
            </div>
            <div v-if="currentChatSession.contactType === 1" class="iconfont icon-more" @click="showGroupDetail">
            </div>
            <div class="chat-panel" v-show="Object.keys(currentChatSession).length > 0">
                <div class="message-panel" ref="messagePanel" id="message-panel">
                    <div class="message-item" v-for="(data,index) in messageList" :id="'message' + data.messageId"
                         :key="index">
                        <!--展示消息时间-->
                        <template
                                v-if="index > 1 && data.sendTime-messageList[index-1].sendTime >= 300000 && (data.messageType === 2 || data.messageType ==5)">
                            <ChatMessageTime :data="data"></ChatMessageTime>
                        </template>
                        <!--展示系统消息-->
                        <template
                                v-if="data.messageType === 3 // 群创建
                            || data.messageType === 1 //打着招呼消息
                            || data.messageType === 9 //加入群组
                            || data.messageType === 8 //解散
                            || data.messageType === 11 //退出
                            || data.messageType === 12 //被踢
                            || data.messageType === 13 //撤回
"
                        >
                            <ChatMessageSys :data="data"></ChatMessageSys>
                        </template>
                        <template v-if="data.messageType === 1 || data.messageType === 2 || data.messageType === 5">
                            <ChatMessage :data="data" :currentChatSession="currentChatSession"></ChatMessage>
                        </template>
                    </div>
                </div>
                <MessageSend :currentChatSession="currentChatSession" @reloadMsg="reloadMsg"></MessageSend>
            </div>
            <div class="chat-blank" v-show="Object.keys(currentChatSession).length === 0">
                <Blank></Blank>
            </div>
        </template>
    </layout>
    <ChatGroupDetail ref="chatGroupDetailRef" @deleteSession="deleteChatSessionList"></ChatGroupDetail>
</template>
<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Chat",
}
</script>
<script setup>
import Layout from "@/components/Layout.vue";
import {getCurrentInstance, nextTick, onMounted, ref, watch} from "vue";
import ChatSessionModel from "@/db/ChatSessionModel";
import ChatSession from "@/views/chat/ChatSession.vue";
import ContextMenu from "@imengyu/vue3-context-menu";
import chatMessageModel from "@/db/ChatMessageModel";
import MessageSend from "@/views/chat/MessageSend.vue";
import EventBus from '../../main'
import ChatMessage from "@/views/chat/ChatMessage.vue";
import Blank from "@/components/Blank.vue";
import {UserControllerService} from "../../../generated";
import {SystemSettingStore} from "@/stores/SysSettingStore";
import ChatMessageTime from "@/views/chat/ChatMessageTime.vue";
import ChatMessageSys from "@/views/chat/ChatMessageSys.vue";
import ChatGroupDetail from "@/views/chat/ChatGroupDetail.vue";
import userSettingModel from "@/db/UserSettingModel";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import {useMessageCountStore} from "@/stores/MessageCountStore";
import router from "@/router";
import wsClient from "@/webSocket/wsClient";
import {useRoute} from "vue-router";
import chatSessionModel from "@/db/ChatSessionModel";
import SearchResult from "@/views/chat/SearchResult.vue";
const login = useLoginUserStore()
const {proxy} = getCurrentInstance()
const sysSetting = SystemSettingStore()
const messageStore = useMessageCountStore()
const route = useRoute()

const chatSessionList = ref([])
const onLoadSessionData = async () => {
    const res = await ChatSessionModel.getAllSessions()
    let noReadCount = 0
    res.forEach(item => {
        noReadCount = noReadCount + item.noReadCount
    })
    messageStore.setChatCount(noReadCount, true)
    sortChatSession(res)
    chatSessionList.value = res
}
const messagePanel = ref()
//底部距离
let distanceToBottom = 0;
//滚动到底部
const goToBottom = () => {
    nextTick(() => {
        if (distanceToBottom > 200) {
            return
        }
        const content = messagePanel.value;
        setTimeout(() => {
            content.scrollTo({top: content.scrollHeight});
        }, 100)
    });
}


//对会话进行排序
const sortChatSession = (dataList) => {
    dataList.sort((a, b) => {
        const topTypeResult = b["topType"] - a["topType"]
        if (topTypeResult === 0) {
            return b["lastReceiveTime"] - a["lastReceiveTime"]
        }
        return topTypeResult
    })
}


//置顶会话
const setTop = (item) => {
    if (item.topType === 0) {
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
    distanceToBottom = 0;
    messageCountInfo.pageNo = 0
    messageCountInfo.pageTotal = 0;
    messageCountInfo.nodata = false
    messageCountInfo.maxMessageId = null;
    messageList.value = []
    messageStore.setChatCount(-item.noReadCount, true);
    item.noReadCount = 0;
    ChatSessionModel.clearNoReadCount(currentChatSession.value.sessionId)
    localStorage.setItem("currentSessionId", currentChatSession.value.sessionId)
    loadChatMessage()
    goToBottom()
}

const loadChatMessage = () => {
    if (messageCountInfo.nodata) {
        return
    }
    messageCountInfo.pageNo++
    //@ts-ignore
     chatMessageModel.getChatMessage(currentChatSession.value.sessionId, messageCountInfo.pageNo, messageCountInfo.maxMessageId).then(res => {
        if (res.messageCount === res.currentPage) {
            messageCountInfo.nodata = true
        }
        const dataList = res.messages
        dataList.sort((a, b) => {
            //@ts-ignore
            return a.messageId - b.messageId
        })
         // 创建一个新的数组用于存储去重后的数据
         const uniqueDataList = [];
        // 遍历 dataList，并将不重复的元素添加到 uniqueDataList 中
         for (let i = 0; i < dataList.length; i++) {
             if (i === 0 || dataList[i].messageId != dataList[i - 1].messageId) {
                 uniqueDataList.push(dataList[i]);
             }
         }
        const lastMessage = messageList.value[0];
        //分页一点一点添加
        messageList.value =  uniqueDataList.concat(messageList.value)
        // //console.log(messageList.value)
        messageCountInfo.pageNo = res.currentPage;
        messageCountInfo.pageTotal = res.messageCount;
        if (res.currentPage === 1) {
            //@ts-ignore
            messageCountInfo.maxMessageId = res.messages.length > 0 ? res.messages[res.messages.length - 1].messageId : null
            goToBottom()
        } else {
            //当前分页不为1的时候，向上滚动的时候会将滚动条限制到上一个分页的消息处
            nextTick(() => {
                document.querySelector("#message" + lastMessage.messageId)?.scrollIntoView()
            })
        }
        //console.log(messageList.value)
    }).catch((err) => {
        //console.log(err, "出错")
    })
}

const loadSendChatMessage = (messageId) => {
    if (messageCountInfo.nodata) {
        return
    }
    chatMessageModel.getMessageById(messageId).then(res => {
        //分页一点一点添加
        messageList.value = messageList.value.concat(res)
        //console.log(messageList.value)
    })
}


//删除会话
const deleteChatSessionList = (contactId) => {
    chatSessionList.value = chatSessionList.value.filter(item => item.contactId !== contactId)
}

const deleteSession = (item) => {
    deleteChatSessionList(item.contactId)
    item.status = 0;
    ChatSessionModel.updateAll(item)
    localStorage.setItem("currentSessionId", null)
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
                label: item.topType === 0 ? '置顶' : '取消置顶',
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
                               currentChatSession.value = {}
                                //console.log(Object.keys(currentChatSession).length)
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
    goToBottom()
    onLoadSessionData()
}


const getSystemSetting = async () => {
    const res = await UserControllerService.getSysSettingUsingGet1()
    sysSetting.setSysSetting(res.data)
}

//加载好友申请
const loadContactApply = async () => {
    // debugger
    const result = await userSettingModel.getUserSetting(login.loginUser.id)
    if (result != null) {
        //@ts-ignore
        messageStore.setContactApplyCount(result.noReadCount, true);
    }
}

//群详情实现
const chatGroupDetailRef = ref(null)
const showGroupDetail = () => {
    chatGroupDetailRef.value.show(currentChatSession.value.contactId)
}

//重新加载
const reloadChatSession = async (contactId) => {
    await chatSessionModel.ReloadChatSession(contactId)
    await onLoadSessionData()
    await sendMessage(contactId)
}

//重新加载会话
const sendMessage = async (contactId) => {
    let curSession = chatSessionList.value.find(item => item.contactId == contactId)
    if (curSession == null) {
        //加载会话
       await reloadChatSession(contactId)
    } else {
        ChatSessionClickHandle(curSession)
    }
}

watch(() => route.query.timestamp, (newValue, oldValue) => {
    if (newValue && route.query.chatId) {
        sendMessage(route.query.chatId)
    }
}, {
    deep: true,
    immediate: true
})

const searchKey = ref("");
const searchList = ref([])
const search = () => {
    if (!searchKey.value){
        return
    }
    searchList.value = []
    const regex = new RegExp('(' + searchKey.value + ')', 'gi')
    chatSessionList.value.forEach(item => {
        if (item.contactName.includes(searchKey.value) || item.lastMessage.includes(searchKey.value)){
            let newData = Object.assign({},item)
            newData.serchContactName = item.contactName.replace(regex, "<span class='highlight'>$1</span>")
            newData.serchLastMessage = item.lastMessage.replace(regex, "<span class='highlight'>$1</span>")
            searchList.value.push(newData)
        }
    })
}

const searchClickHandler = (item) => {
    searchKey.value = undefined
    ChatSessionClickHandle(item)
}

onMounted(() => {
    onLoadSessionData()
    getSystemSetting()
    loadContactApply()
    localStorage.setItem("currentSessionId", currentChatSession.value.sessionId)
    EventBus.on("reloadMessage", (message) => {
        //好友申请消息
        if (message.messageType === 4) {
            loadContactApply()
            return
        }
        //强制下线
        if (message.messageType === 7) {
            proxy.Confirm({
                message: "您已被强制下线，请重新登录",
                okfun: () => {
                    setTimeout(() => {
                        wsClient.closeWs()
                        router.push('/user/login')
                    }, 200)
                },
                showCancelBtn: false
            })
            return
        }
        //更改群名称
        if (message.messageType === 10) {
            const curSession = chatSessionList.value.find(item => {
                return item.contactId === message.contactId
            })
            curSession.contactName = message.extendData
            return;
        }
        //文件消息
        if (message.messageType === 6) {
            const localMessage = messageList.value.find(item => {
                if (item.messageId === message.messageId) {
                    return item
                }
            })
            if (localMessage != null) {
                localMessage.status = 1;
                localMessage.messageContent = message.messageContent;
                localMessage.videoCoverUrl = message.videoCoverUrl;
            }
            return
        }

        const curSession = chatSessionList.value.find(item => {
            return item.sessionId === message.sessionId
        })
        if (curSession == null) {
            //console.log(message.extendData, "消息体")
            chatSessionList.value.push(message.extendData)
        } else {
            Object.assign(curSession, message.extendData)
        }
        sortChatSession(chatSessionList.value)
        if (message.sessionId !== currentChatSession.value.sessionId) {
            //console.log(message.sessionId !== currentChatSession.value.sessionId)
            messageStore.setChatCount(1, false);
        } else {
            //console.log(messageList.value)
            Object.assign(currentChatSession.value, message.extendData)
            messageList.value.push(message)
            goToBottom()
        }
    })
    nextTick(() => {
        const content = messagePanel.value;
        content.addEventListener('scroll', (e) => {
            const scrollTop = e.target.scrollTop;
            //计算到底部的距离
            distanceToBottom = content.scrollHeight - content.clientHeight - scrollTop;
            if (scrollTop === 0 && messageList.value.length > 0) {
                loadChatMessage()
            }
        })
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
        width: 81%;

        .message-item {
            /*margin-bottom: 15px;*/
            /*height: 35px;*/
            display: block;
            text-align: center;
        }
    }
}
</style>