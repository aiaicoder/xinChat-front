<template>
    <div class="top-panel">
        <el-card>
            <el-form :model="searchForm" label-width="70px" label-position="right">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="UID" label-width="40px">
                            <el-input
                                    class="password-input"
                                    v-model="searchForm.id"
                                    clearable
                                    @keyup.native="loadDataList"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="昵称">
                            <el-input
                                    class="password-input"
                                    v-model="searchForm.userName"
                                    clearable
                                    @keyup.native="loadDataList"
                                    placeholder="支持模糊查询"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :style="{paddingLeft: '10px' }">
                        <el-button type="success" @click="loadDataList()">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
    <el-card class="table-data-card">
        <Table :columns="columns" :fetch="loadDataList" :data-source="tableData" :options="tableOptions">
            <template #slotAvatar="{index,row}">
                <AvatarBase :width="50" :avatar="row.userAvatar" partType="avatar"></AvatarBase>
            </template>
            <template #slotNickName="{index,row}">
                {{ row.userName }}
                ({{ row.id }})
                <span v-if="row.sex == 0" class="iconfont icon-woman"></span>
                <span v-if="row.sex == 1" class="iconfont icon-man"></span>
            </template>
            <template #slotStatus="{index,row}">
                <span style="color: red" v-if="row.userStatus == 0">禁用</span>
                <span style="color: green" v-else>启用</span>
            </template>
            <template #slotOnlineStatus="{index,row}">
                <span style="color: green" v-if="row.onlineType == 1">在线</span>
                <span style="color: #8a8a8a" v-else>离线</span>
            </template>

            <template #slotOperation="{index,row}">
                <el-dropdown placement="bottom-end" trigger="click" v-if="login.loginUser.id != row.id">
                    <span class="iconfont icon-more"></span>
                    <template #dropdown>
                        <el-dropdown-item @click="changeAccountStatus(row)">
                            {{ row.userStatus == 0 ? '启用' : '禁用' }}
                        </el-dropdown-item>
                        <el-dropdown-item @click="forceOffLine(row)" v-if="row.onlineType ==1">强制下线
                        </el-dropdown-item>
                    </template>
                </el-dropdown>
                <div v-else>管理员</div>
            </template>
        </Table>
    </el-card>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {getCurrentInstance, ref} from "vue";
import Table from "@/components/Table.vue";
import {AdminUserControllerService} from "../../../generated";
import Avatar from "@/components/Avatar.vue";
import AvatarBase from "@/components/AvatarBase.vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import {ElMessage} from "element-plus";

const login = useLoginUserStore()
const router = useRouter();
const route = useRoute();
const tableData = ref({});
const tableOptions = ref({});
const columns = ref([
    {
        label: '头像',
        prop: 'avtar',
        width: 70,
        scopedSlots: 'slotAvatar'
    },
    {
        label: '昵称',
        prop: 'nickName',
        scopedSlots: 'slotNickName'
    },
    {
        label: '邮箱',
        prop: 'email',
        width: 200
    },
    {
        label: '加入时间',
        prop: 'createTime',
        width: 200
    },
    {
        label: '地区',
        prop: 'areaName',
        width: 200,
    },
    {
        label: '用户状态',
        prop: 'status',
        width: 100,
        scopedSlots: 'slotStatus'
    },
    {
        label: '在线状态',
        prop: 'onlineStatus',
        width: 100,
        scopedSlots: 'slotOnlineStatus'
    },
    {
        label: '操作',
        prop: 'operation',
        width: 100,
        scopedSlots: 'slotOperation'
    }
]);
const searchForm = ref({})
const {proxy} = getCurrentInstance()
const changeAccountStatus = async (data) => {
    const status = data.userStatus == 0 ? 1 : 0;
    const info = status == 0 ? '启用' : '禁用';
    proxy.Confirm({
        message: `确定要【${info}】【${data.userName}】该用户吗？`,
        okfun: async () => {
            const result = await AdminUserControllerService.updateUserStatusUsingPost({
                id: data.id,
                status: status
            })
            if (result.code != 0) {
                return
            }
            ElMessage.success(`${info}成功`)
            await loadDataList()
        }
    })
}

const forceOffLine = async (data) => {
    proxy.Confirm({
        message: `确定要将【${data.userName}】强制下线吗？`,
        okfun: async () => {
            const result = await AdminUserControllerService.forceKickOutUsingGet(data.id)
            if (result.code != 0) {
                return
            }
            ElMessage.success('操作成功')
            await loadDataList()
        }
    })
}
const loadDataList = async () => {
    let params = {
        current: tableData.value.pageNo,
        pageSize: tableData.value.pageSize
    }
    console.log(searchForm.value)
    Object.assign(params, searchForm.value)
    const result = await AdminUserControllerService.listUserByPageUsingPost(params)
    if (result.code != 0) {
        return
    }
    Object.assign(tableData.value, result.data)
}

</script>

<style scoped>
.icon-man {
    color: #2cb6fe;
}

.el-card {
    margin-bottom: 20px;
}

.icon-woman {
    color: #fb7373;
}

</style>