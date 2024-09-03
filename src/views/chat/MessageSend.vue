<template>
    <div class="send-panel">
        <div class="toolbar">
            <el-popover
                    :visible="showEmojiPopover"
                    trigger="click"
                    placement="top"
                    :teleported="false"
                    @show="openPopover"
                    @hide="closePopover"
                    :popper-style="{
                    padding: '0px 10px 10px 10px',
                    width: '400px',
                }"
            >
                <template #default>
                    <el-tabs v-model="activeEmoji" @click.stop>
                        <el-tab-pane :label="emoji.name" :name="emoji.name" v-for="emoji in emojiList"
                                     :key="emoji.name">
                            <div class="emoji-list">
                                <div class="emoji-item" v-for="(item,index) in emoji.emojiList" @click="sendEmoji(item)"
                                     :key="index">
                                    {{ item }}
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </template>
                <template #reference>
                    <div class="iconfont icon-emoji" @click="showEmojiPopoverHandler"></div>
                </template>
            </el-popover>
            <el-upload
                    ref="uploadRef"
                    name="file"
                    :show-file-list="false"
                    :multiple="true"
                    :limit="filelimit"
                    :http-request="uploadFile"
                    :on-exceed="uploadExceed"
            >
                <div class="iconfont icon-folder"></div>
            </el-upload>
        </div>
        <div class="input-area" @drop="dropHandler" @dragover="dragOverHandler">
            <el-input
                    v-model="msgContent"
                    type="textarea"
                    resize="none"
                    :rows="5"
                    placeholder="请输入内容"
                    :maxlength="500"
                    show-word-limit
                    spellcheck="false"
                    input-style="background:#f5f5f5;border:none"
                    @keyup.enter="sendMessage"
                    @paste="pasteFile"
            />
        </div>
        <div class="send-btn-panel">
            <el-popover
                    trigger="click"
                    :visible="showSendMsgPopover"
                    placement="top-end"
                    :teleported="false"
                    @show="openPopover"
                    @hide="closePopover"
                    :popper-style="{
                    padding: '5px',
                    'min-width': '0',
                    width: '120px',
                     }"
            >
                <template #default>
                    <span class="empty-msg">不能发送空白消息</span>
                </template>
                <template #reference>
                    <div class="send-btn" @click="sendMessage($event)">发送(S)</div>
                </template>
            </el-popover>
        </div>
        <SearchAdd ref="searchAddRef"></SearchAdd>
    </div>
</template>

<script setup lang="ts">
import emojiList from "@/constant/emojiList";
import {getCurrentInstance, ref} from "vue";

import {ChatControllerService} from "../../../generated";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import SearchAdd from "@/views/contact/SearchAdd.vue";
import ChatMessageModel from "@/db/ChatMessageModel";
import ChatSessionModel from "@/db/ChatSessionModel";
import {getFileType} from "@/constant/FileType";
import {SystemSettingStore} from "@/stores/SysSettingStore";
const sysSetting = SystemSettingStore()
const activeEmoji = ref('笑脸');
const msgContent = ref(''); //消息内容
const {proxy} = getCurrentInstance()
const showEmojiPopover = ref(false);
const showSendMsgPopover = ref(false);
const useLogin = useLoginUserStore()
const props = defineProps({
    currentChatSession: {
        type: Object,
        default: () => {
        }
    },
});
const hidePopover = () => {
    showEmojiPopover.value = false;
    showSendMsgPopover.value = false;
};

const emit = defineEmits(['reloadMsg']);
const sendMessage = (e) => {
    if (e.shiftKey && e.keyCode === 13) {
        return
    }
    e.preventDefault();
    //若有值，则使用正则表达式移除字符串末尾的空白字符
    const messageContent = msgContent.value ? msgContent.value.replace(/\s*$/g, '') : '';
    if (messageContent == '') {
        showSendMsgPopover.value = true;
        setTimeout(() => {
            showSendMsgPopover.value = false;
        }, 1500);
        return
    }
    sendMessageDo({messageContent, messageType: 2}, true, null)
};
//添加好友
const searchAddRef = ref();
const addContact = (contactId, code) => {
    searchAddRef.value.show({
        contactId,
        contactType: code == 90003 ? "USER" : "GROUP"
    })
}
const uploadRef = ref();

//上传文件
const uploadFile = (file) => {
    uploadFileDo(file.file)
    uploadRef.value.clearFiles()
}

//通过文件后缀获取文件类型
const getFileTYpeByName = (fileName: string) => {
    const suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
    return getFileType(suffix)
}

//真正上传文件
const uploadFileDo = (file) => {
    const fileType = getFileTYpeByName(file.name)
    sendMessageDo({
        messageContent: '[' + getFileType(fileType) + ']',
        messageType: 5,
        fileSize: file.size,
        fileName: file.name,
        fileType: fileType
    }, false, file)

}


const uploadExceed = (files) => {
    checkFileLimit(files)
}

//展示表情
const showEmojiPopoverHandler = () => {
    showEmojiPopover.value = !showEmojiPopover.value;
}
const openPopover = () => {
    document.addEventListener('click', hidePopover,false)
}

const closePopover = () => {
    document.removeEventListener('click', hidePopover,false )
}

//发送表情
const sendEmoji = (emoji) => {
    msgContent.value += emoji;
    showEmojiPopover.value = false;
}

const sendMessageDo = async (messageObj: Object = {
    messageContent,
    messageType,
    fileSize,
    fileName,
    fileType,
    sessionId,
    sendUserId,
    contactId
}, cleanMsgContent, file) => {
    //判断文件大小
    if (messageObj.fileSize == 0) {
        proxy.Confirm({message: `${messageObj.fileName}是一个空文件无法发送,请重新选择`, showCancelButton: false,})
        return
    }
    if (!checkFile(messageObj.fileType,messageObj.fileSize,messageObj.fileName)){
        return;
    }
    messageObj.sessionId = props.currentChatSession.sessionId;
    messageObj.sendUserId = useLogin.loginUser.id;
    messageObj.contactId = props.currentChatSession.contactId;
    const res = await ChatControllerService.sendMessageUsingPost(messageObj)
    if (!res) {
        return
    }
    if (res.code != 0) {
        proxy.Confirm(
            {
                message: res.message,
                okfun: async () => {
                    addContact(props.currentChatSession.contactId, res.code)
                },
                okText: "重新申请"
            }
        )
    }
    if (cleanMsgContent) {
        msgContent.value = ''
    }
    Object.assign(messageObj, res.data)
    messageObj.lastReceiveTime = messageObj.sendTime
    if (file) {
        let biz = '';
        if (messageObj.fileType == 0) {
            biz = 'picture'
        } else if (messageObj.fileType == 1) {
            biz = 'video'
        }else {
            biz = 'file'
        }
        const res = await ChatControllerService.uploadFileUsingPost(file, biz, messageObj.messageId)
        if (res.code === 0){
            messageObj.status = 1;
            messageObj.fileUrl = res.data.fileUrl;
            if (res.data.videoCoverUrl){
                messageObj.videoCoverUrl = res.data.videoCoverUrl;
            }
        }
    }
    // 会话更新列表
    await ChatSessionModel.update(messageObj, props.currentChatSession.sessionId)
    //保存消息到本地
    await ChatMessageModel.saveChatMessage(messageObj)
    emit('reloadMsg', res.data.messageId)
}

//校验文件大小
const checkFile = (fileType,fileSize,fileName) =>{
    const SIZE_MB = 1024 * 1024;
    const settingArray = Object.values(sysSetting.sysSetting)
    const fileSizeNumber = settingArray[fileType]
    if (fileSize > fileSizeNumber * SIZE_MB){
        proxy.Confirm({
            message: `${fileName}超过大小${fileSizeNumber}MB限制`,
            showCancelButton: false,
        })
        return false
    }
    return true;
}

//发送文件数量
const fileLimit = 10
const checkFileLimit = (files) =>{
    if (files.length > fileLimit){
        console.log(files)
        proxy.Confirm({
            message: `最多只能选择${fileLimit}个文件`,
            showCancelButton: false,
        })
        return
    }
    return true
}


//拖入文件
const dragOverHandler = (e) => {
    e.preventDefault()
}

const dropHandler = (e) => {
    e.preventDefault()
    const files  = e.dataTransfer.files
    if (!checkFileLimit(files)){
        return;
    }
    for (let i = 0; i < files.length; i++) {
        uploadFileDo(files[i])
    }
}

const pasteFile = async (event) =>{
    let item = event.clipboardData && event.clipboardData.items;
    console.log(item)
}
</script>

<style lang="scss" scoped>

.emoji-list {
  //加上高度限制
  max-height: 300px;
  overflow-y: scroll;

  .emoji-item {
    float: left;
    font-size: 23px;
    padding: 2px;
    text-align: center;
    border-radius: 3px;
    margin-left: 10px;
    margin-top: 5px;
    cursor: pointer;

    &:hover {
      background-color: #ddd;
    }
  }
}

.send-panel {
  height: 200px;
  border-top: 1px solid #ddd;

  .toolbar {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 10px;

    .iconfont {
      color: #494949;
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }
  }

  .input-area {
    padding: 0 10px;
    outline: none;
    width: calc(100% - 310px); // 减去左右 padding
    height: 115px;
    overflow: auto;
    word-wrap: break-word;
    word-break: break-all;

    :deep(.el-textarea__inner) {
      box-shadow: none;
    }

    :deep(.el-input__count) {
      background: none;
      right: 12px;
    }
  }

  .send-btn-panel {
    display: flex; // 使用 flex 布局
    justify-content: flex-end; // 对齐到右侧
    padding-top: 10px;
    padding-right: 10px; // 添加右侧 padding
    width: calc(100% - 310px); // 减去左右 padding

    .send-btn {
      cursor: pointer;
      color: #07c160;
      background: #e9e9e9;
      border-radius: 5px;
      padding: 8px 25px;
      width: 100px;

      &:hover {
        background: #d2d2d2;
      }
    }

    .empty-msg {
      font-size: 13px;
      display: inline-block; /* 使文本更紧凑 */
    }
  }
}

</style>