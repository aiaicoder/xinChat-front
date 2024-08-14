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
                        <template v-for="(contact,index) in item.contactData" :key='index'>
                            <div :class="['part-item',contact[item.contactId] == route.query.contactId ? 'active' : '']"
                                 @click="contactDetail(contact,item)">
                                <Avatar :userId="contact[item.contactId]" width="35" height="35" borderRadius="50%"
                                        showDetail/>
                                <div class="text">{{ contact[item.contactName] }}</div>
                            </div>
                        </template>
                        <template v-if="item.contactData && item.contactData.length == 0">
                            <div class="no-data">
                                {{ item.emptyMsg }}
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </template>
        <template #right-content>
            <div class="title-panel drag">{{ rightTile }}</div>
            <router-view v-slot="{ Component }">
                <component :is="Component" ref="componentRef"></component>
            </router-view>
        </template>
    </Layout>
</template>

<script setup lang="ts">
import Layout from "@/components/Layout.vue";
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {GroupInfoControllerService, UserContactControllerService} from "../../../generated";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import Avatar from "@/components/Avatar.vue";
import {ElMessage} from "element-plus";
import {ContactSateStore} from "@/stores/ContactStateStore";


const contactStore = ContactSateStore();
const route = useRoute();
const router = useRouter()
const rightTile = ref()
const loginUse = useLoginUserStore()
const searchKey = ref()
const partList = ref([
    {
        partName: '新朋友',
        children: [
            {
                name: '搜好友',
                icon: 'icon-search',
                iconBgColor: '#fa9d3b',
                showTitle: true,
                path: '/contact/search'
            },
            {
                name: '新的朋友',
                icon: 'icon-plane',
                iconBgColor: '#08bf61',
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
const search = () => {

}
const partJump = (data: any) => {
    if (data.showTitle) {
        rightTile.value = data.name
    } else {
        rightTile.value = null
    }
    //todo 处理联系人好友申请一读
    console.log(data)
    router.push(data.path)
}
const contactDetail = (contact: any, part: any) => {
    if (part.showTitle){
        rightTile.value = contact[part.contactName]
    }else {
        rightTile.value = null
    }
    router.push({
        path: part.contactPath,
        query: {
            contactId: contact[part.contactId]
        }
    })
}

const loadContact = async (contactType: String) => {
    const loadUserContact = {
        userId: loginUse.loginUser.id,
        contactType: contactType,
    }
    const result = await UserContactControllerService.loadContactUsingPost1(loadUserContact)
    if (result.code !== 0) {
        return;
    }

    if (contactType === 'GROUP') {
        partList.value[2].contactData = result.data.records;
    } else if (contactType === 'USER') {
        partList.value[3].contactData = result.data.records;
    }
}

const loadMyGroup = async () => {
    const result = await GroupInfoControllerService.loadMyGroupUsingPost1()
    if (result.code === 0) {
        partList.value[1].contactData = result.data;
    } else {
        ElMessage.error(result.message)
    }
}

watch(() => contactStore.contactReload, (newVal, oldValue) => {
    if (!newVal) {
        return;
    }
    switch (newVal) {
        case "USER":
        case "GROUP":
            loadContact(newVal)
            break;
        case "MY":
            loadMyGroup()
            break;
        case "DISSOLUTION_GROUP":
            loadMyGroup()
            router.push("/contact/blank")
            rightTile.value = null
            break;
        case "LEAVE_GROUP":
            loadContact("GROUP")
            router.push("/contact/blank")
            rightTile.value = null
            break;
        case "REMOVE_USER":
            loadContact('USER')
            router.push("/contact/blank")
            rightTile.value = null
            break;
    }
}, {immediate: true, deep: true})
onMounted(() => {
    loadContact('GROUP')
    loadContact('USER')
    loadMyGroup()
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

.contact-list {
    border-top: 1px solid #ddd;
    height: calc(100vh - 70px);
    overflow: hidden;
    &:hover {
        overflow: auto;
    }

    .part-tile {
        color: #515151;
        padding-left: 5px;
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
                background: #d6d6d7;
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

        .no-data {
            text-align: center;
            font-size: 12px;
            color: #9d9d9d;
            line-height: 30px;
        }

        .active {
            background: #c4c4c4;

            &:hover {
                background: #c4c4c4;
            }
        }
    }
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