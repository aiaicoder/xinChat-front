<template>
    <Layout>
        <template #left-content>
            <div class="drag-panel"></div>
            <div class="top-search">
                <el-input clearable placeholder="搜索" size="small" v-model="searchKey" @keyup="search">
                    <template #suffix>
                        <span class="iconfont icon-search"></span>
                    </template>
                </el-input>
            </div>
            <div class="contact-list">
                <template v-for="(item,index) in partList" :key="index">
                    <div class="part-tile">{{ item.partName }}</div>
                    <div class="part-list">
                        <div
                                v-for="(sub,index) in item.children" :key="index"
                                :class="['part-item',sub.path == route.path ? 'active' : '']"
                                @click="partJump(sub)"
                        >
                            <div :class="['iconfont',sub.icon]" :style="{background: sub.iconBgColor}"></div>
                            <div class="text">{{ sub.name }}</div>
                        </div>
                    </div>
                    <template v-for="(contact,index) in item.contactData" :key='index'></template>
                    <template v-if="item.contactData && item.contactData.length == 0">
                        <div class="no-data">
                            {{ item.emptyMsg }}
                        </div>
                    </template>
                </template>
            </div>
        </template>
        <template #right-content>
            <div class="title-panel drag">{{rightTile}}</div>
        </template>
    </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
import {ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const partList = ref([
    {
        partName: '新朋友',
        children: [
            {
                name: '搜好友',
                icon: 'icon-search',
                iconBgColor: '#fa9d3b',
                path: '/contact/search'
            },
            {
                name: '新的朋友',
                icon: 'icon-add',
                iconBgColor: '#fa9d3b',
                path: '/contact/add',
                showTitle: true,
                countKey: 'contactApplyCount'
            }
        ]
    },
    {
        partName: '我的群聊',
        children: [
            {
                name: '新建群聊',
                icon: 'icon-add-group',
                iconBgColor: '#1485ee',
                path: '/contact/createGroup',
            }
        ],
        contactId: 'groupId',
        contactName: 'groupName',
        showTitle: true,
        contactData: [],
        contactPath: '/contact/groupDetail'
    },
    {
        partName: '我的加入的群聊',
        contactId: 'contactId',
        contactName: 'contactName',
        showTitle: true,
        contactData: [],
        contactPath: '/contact/groupDetail',
        emptyMsg: '暂无群聊',
    },
    {
        partName: '我的好友',
        children: [],
        contactId: 'contactId',
        contactName: 'contactName',
        showTitle: true,
        contactData: [],
        contactPath: '/contact/userDetail',
        emptyMsg: '暂无好友',
    }

])

const rightTile = ref()
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
}

.iconfont {
    font-size: 12px;
}

.contact-list {
    border-top: 1px solid #ddd;
    height: calc(100vh - 50px);
    overflow: hidden;

    &:hover {
        overflow-y: auto;
    }
}

.part-tile {
    color: #515151;
    padding-left: 10px;
    margin-top: 10px;
}

.part-list {
    border-bottom: 1px solid #d6d6d6;

    .part-item {
        display: flex;
        align-items: center;
        padding: 10px 10px;
        position: relative;

        &:hover {
            cursor: pointer;
            background: #d6d6d6;
        }
    }

    .iconfont {
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
    }

    .text {
        flex: 1;
        color: #000000;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .active {
        background: #c4c4c4;

        &:hover {
            background: #c4c4c4;
        }
    }
}

.no-data {
    text-align: center;
    font-size: 12px;
    color: #9d9d9d;
    line-height: 30px;
}

.title-panel {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: 18px;
    color: #000000;
}
</style>