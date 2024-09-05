<template>
    <div class="group-panel">
        <el-drawer v-model="showDrawer" modal-class="mask-style" :size="300" ref="drawerRef">
            <div class="group-panel-body">
                <div class="member-list">
                    <div class="member-item" v-for="item in memberList" :key="item.userId">
                        <Avatar :avatar="item.avatar" :width="30" @closeDrawer="closeDrawerHandler"/>
                        <div class="nick-name" :title="item.contactName"></div>
                        <div class="owner-tag" v-if="item.userId == groupInfo.groupOwnerId">群主</div>
                    </div>
                    <template v-if="loginStore.loginUser.id == groupInfo.groupOwnerId">
                        <div class="member-item" @click="addUser">
                            <div class="iconfont icon-add icon-op"></div>
                            <div class="nick-name">添加</div>
                        </div>
                        <div class="member-item" @click="removerUser">
                            <div class="iconfont icon-add icon-op"></div>
                            <div class="nick-name">移除</div>
                        </div>
                    </template>
                </div>
                <div class="line"></div>
                <div class="part-content">
                    <AvatarBase
                        :avatar="groupInfo.groupAvatar"
                        :width="60"
                        :show-detail="true"
                        :border-radius="5"
                    ></AvatarBase>
                </div>
                <div class="part-tile">群号</div>
                <div class="part-content">{{groupInfo.gourpId}}</div>
                <div class="part-tile">群聊名称</div>
                <div class="part-content">{{groupInfo.groupName}}</div>
                <div class="part-tile">群公告</div>
                <div class="part-content">{{groupInfo.groupNotice || '-'}}</div>
                <div class="line"></div>
                <a href="javascript:void(0);"
                   class="leave-btn"
                   @click="dissolutionGroup"
                   v-if="loginStore.loginUser.id === groupInfo.groupOwnerId"
                >解散群聊</a>
                <a href="javascript:void(0);"
                   class="leave-btn"
                   @click="leaveGroup"
                   v-else
                >退出群聊</a>
            </div>

        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {GroupInfoControllerService} from "../../../generated";
import {ElMessage} from "element-plus";
import Avatar from "@/components/Avatar.vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import AvatarBase from "@/components/AvatarBase.vue";
const loginStore = useLoginUserStore()
const showDrawer = ref(false);
const memberList = ref([]);
const groupInfo = ref({});
const show =  async (groupId) =>{
    let result = await GroupInfoControllerService.getGroupInfoChatUsingPost({
        groupId: groupId
    })
    if (result.code === 0){
        groupInfo.value = result.data.groupInfo;
        memberList.value = result.data.userContactList;
        showDrawer.value = true;
    }else {
        ElMessage({
            message: result.message,
            type: 'error',
        })
    }

}
defineExpose({show})

const drawerRef = ref(null);
const closeDrawerHandler = () => {
    drawerRef.value.close();
}
</script>

<style lang="scss" scoped>
.group-panel {
  color: #000000;

  :deep(.mask-style) {
    top: 1px;
    right: 1px;
    height: calc(100vh - 2px);
  }

  :deep(.el-drawer) {
    -webkit-app-region: no-drag;
  }

  :deep(.el-drawer__header) {
    margin-bottom: 10px;
  }

  :deep(.el-drawer__body) {
    padding: 10px;
  }

  .group-panel-body {
    .member-list {
      display: flex;
      flex-wrap: wrap;

      .member-item {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 5px;
        padding: 5px;
        position: relative;

        .owner-tag {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 12px;
          background: #07c160;
          color: #ffffff;
          border-radius: 3px;
        }

        .nick-name {
          margin-top: 3px;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          text-align: center;
        }

        .icon-op {
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #dbdbdb;
          color: #6e6e6e;
        }
      }
    }

    .line {
      margin-bottom: 10px;
      border-top: 1px solid #ddd;
      height: 1px;
    }

    .part-tile {
      margin-top: 10px;
    }

    .part-content {
      color: #757575;
      margin-bottom: 10px;
    }

    .leave-btn {
      color: #f45454;
      text-decoration: none;
      text-align: center;
      display: block;
      margin-top: 10px;
    }
  }
}
</style>