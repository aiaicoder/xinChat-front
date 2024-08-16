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
        </template>
    </layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
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