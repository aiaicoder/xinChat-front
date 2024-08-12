<template>
    <ContentPanel>
        <div class="search-form">
            <el-input
                    placeholder="请输入用户ID或者群组ID"
                    v-model="contactId"
                    class="search-input"
                    clearable
                    size="large"
                    @keyup.enter="search"
            >
            </el-input>
            <div class="search-btn iconfont icon-search" @click="search"></div>
        </div>
        <div v-if="searchResult && Object.keys(searchResult).length > 0" class="search-result-panel">
            <div class="search-result">
                <span class="contact-type">
                    {{ contactTypeName }}
                </span>
                <UserBaseInfo :user-info="searchResult" :show-area="searchResult.contactType == 'USER'"></UserBaseInfo>
            </div>
            <div class="op-btn" v-if="searchResult.contactId != loginStore.loginUser.id">
                <el-button
                        type="primary"
                        v-if="
                    searchResult.status == null ||
                    searchResult.status == 0 ||
                    searchResult.status == 2 ||
                    searchResult.status == 3 ||
                    searchResult.status == 4
                   "
                        @click="applyContact"
                >{{ searchResult.contactType == 'USER' ? "添加到联系人" : "申请加群" }}
                </el-button>
                <el-button type="primary" v-if="searchResult.status == 1" @click="sendMessage">
                    发消息
                </el-button>
                <span v-if="searchResult.status == 5 || searchResult.status == 6">对方拉黑了你</span>
            </div>
        </div>
        <div v-if="!searchResult" class="no-data">没有搜索到任何结果</div>
    </ContentPanel>
    <SearchAdd ref="searchAddRef" @reload="restForm"></SearchAdd>
</template>

<script setup lang="ts">
import ContentPanel from "@/components/ContentPanel.vue";
import {computed,ref} from "vue";
import {ElMessage} from "element-plus";
import {UserContactControllerService} from "../../../generated";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import UserBaseInfo from "@/components/UserBaseInfo.vue";
import SearchAdd from "@/views/contact/SearchAdd.vue";

const contactId = ref("");
const loginStore = useLoginUserStore();
const searchResult = ref({});
const contactTypeName = computed(() => {
    if (loginStore.loginUser.id === searchResult.value.contactId) {
        return '自己';
    }
    if (searchResult.value.contactType == 'USER') {
        return '用户';
    } else {
        return '群组';
    }
});
const search = async () => {
    if (!contactId.value) {
        ElMessage({
            message: "请输入用户ID或者群组ID",
            type: "warning",
            duration: 1000
        })
        return;
    }
    const result = await UserContactControllerService.searchUsingPost1({
        userId: loginStore.loginUser.id,
        contactId: contactId.value
    })
    if (result.code === 0 && result.data) {
        searchResult.value = result.data;
    } else {
        searchResult.value = null;
    }
}
const searchAddRef = ref();
const applyContact = () => {
    searchAddRef.value.show(searchResult.value);
}
const restForm = () => {
    //@ts-ignore
    searchResult.value = null;
    contactId.value = '';
}

</script>

<style lang="scss" scoped>
.search-form {
  padding-top: 50px;
  display: flex;
  align-items: center;

  :deep(.el-input_wrapper) {
    border-radius: 4px 0 0 4px;
  }

  .search-btn {
    background: #07c160;
    color: #fff;
    line-height: 40px;
    width: 80px;
    text-align: center;
    border-radius: 0 5px 5px 0;
    cursor: pointer;

    &:hover {
      background: #07c160;
    }
  }
}

.no-data {
  padding: 30px 0;
}

.search-result-panel {
  .search-result {
    padding: 30px 20px 20px 20px;
    background: #fff;
    border-radius: 5px;
    margin-top: 10px;
    position: relative;

    .contact-type {
      position: absolute;
      left: 0;
      top: 0;
      background: #2cb6fe;
      padding: 2px 5px;
      color: #fff;
      border-radius: 5px 0 0 0;
      font-size: 12px;
    }
  }

  .op-btn {
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    background: #fff;
    text-align: center;
  }
}
</style>