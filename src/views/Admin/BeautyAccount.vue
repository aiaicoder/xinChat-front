<template>
    <div class="top-panel">
        <el-card>
            <el-form :model="searchForm" label-width="70px" label-position="right">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="靓号" label-width="40px">
                            <el-input
                                    class="password-input"
                                    v-model="searchForm.id"
                                    clearable
                                    placeholder="支持模糊查询"
                                    @keyup.native="loadDataList"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="邮箱">
                            <el-input
                                    class="password-input"
                                    v-model="searchForm.email"
                                    clearable
                                    @keyup.native="loadDataList"
                                    placeholder="支持模糊查询"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" :style="{paddingLeft: '10px' }">
                        <el-button type="success" @click="loadDataList()">查询</el-button>
                        <el-button type="success" @click="editAccount()">新增靓号</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
    <el-card class="table-data-card">
        <Table :columns="columns" :fetch="loadDataList" :data-source="tableData" :options="tableOptions">
            <template #slotStatus="{index,row}">
                <span style="color: red" v-if="row.status == 0">未使用</span>
                <span style="color: green" v-else>已使用</span>
            </template>
            <template #slotOperation="{index,row}">
                <el-dropdown placement="bottom-end" trigger="click">
                    <span class="iconfont icon-more"></span>
                    <template #dropdown>
                        <el-dropdown-item @click="editAccount(row)" v-if="row.status == 0">
                            修改
                        </el-dropdown-item>
                        <el-dropdown-item @click="delAccount(row)">删除</el-dropdown-item>
                    </template>
                </el-dropdown>
            </template>
        </Table>
    </el-card>
    <BeautyAccountEdit ref="beautyAccountEditRef" @reload="loadDataList"></BeautyAccountEdit>
</template>

<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import {AdminUserBeautyControllerService} from "../../../generated";
import Table from "@/components/Table.vue";
import AvatarBase from "@/components/AvatarBase.vue";
import BeautyAccountEdit from "@/views/Admin/BeautyAccountEdit.vue";
import {ElMessage} from "element-plus";
const {proxy} = getCurrentInstance()
const tableData = ref([]);
const tableOptions = {}
const columns = [
    {
        label: '邮箱',
        prop: 'email'
    },
    {
        label: '靓号',
        prop: 'userId'
    },
    {
        label: '状态',
        prop: 'status',
        scopedSlots: 'slotStatus'
    },
    {
        label: '操作',
        prop: 'operation',
        scopedSlots: 'slotOperation'
    }
]

const searchForm = ref({})
const loadDataList = async () => {
    let params = {
        current: tableData.value.pageNo,
        pageSize: tableData.value.pageSize
    }
    console.log(searchForm.value)
    Object.assign(params, searchForm.value)
    const result = await AdminUserBeautyControllerService.loadBeautyListUsingPost(params)
    if (result.code != 0) {
        return
    }
    Object.assign(tableData.value, result.data)
}
const beautyAccountEditRef = ref()
const editAccount = (data) => {
    beautyAccountEditRef.value.showEdit(data)
}

const delAccount = async (data) => {
    proxy.Confirm({
        message: `确定要删除邮箱【${data.email}】对应的靓号吗？`,
        okfun: async () => {
            const result = await AdminUserBeautyControllerService.deleteUserBeautyUsingGet(data.id)
            if (result.code != 0) {
                return
            }
            ElMessage.success('删除成功')
            await loadDataList()
        }
    })

}
</script>

<style scoped>
.el-card {
    margin-bottom: 20px;
}
</style>