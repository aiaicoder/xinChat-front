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
                    :visible="showSendMsgPopver"
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
                    <div class="send-btn" @click="sendMessage">发送(S)</div>
                </template>
            </el-popover>
        </div>
    </div>
</template>

<script setup lang="ts">
import emojiList from "@/constant/emojiList";
import {ref} from "vue";

const activeEmoji = ref('笑脸');
const msgContent = ref(''); //消息内容
const sendMessage = () => {
    //发送消息
    console.log(msgContent.value);
};
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