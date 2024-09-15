<template>
    <div class="top-panel">
        <el-card>
            <el-form :model="searchForm" label-width="70px" label-position="right">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="群ID" label-width="40px">
                            <el-input
                                    class="password-input"
                                    v-model="searchForm.groupId"
                                    clearable
                                    @keyup.native="loadDataList"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="群名称">
                            <el-input
                                    class="password-input"
                                    v-model="searchForm.groupName"
                                    clearable
                                    @keyup.native="loadDataList"
                                    placeholder="支持模糊查询"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="群主UID">
                            <el-input
                                    class="password-input"
                                    v-model="searchForm.userId"
                                    clearable
                                    @keyup.native="loadDataList"
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
                <AvatarBase :width="50" :avatar="row.groupAvatar" partType="avatar"></AvatarBase>
            </template>
            <template #slotGroupName="{index,row}">
                {{ row.groupName }} ({{ row.groupId }})
            </template>
            <template #slotGroupOwnerNickName="{index,row}">
                {{ row.ownerName }} ({{ row.groupOwnerId }})
            </template>
            <template #slotJoinType="{index,row}">
                <div>{{ row.joinType == 0 ? "直接加入" : '管理员同意后加入' }}</div>
            </template>
            <template #slotStatus="{index,row}">
                <span style="color: red" v-if="row.status == 0">已解散</span>
                <span style="color: green" v-if="row.status == 1">正常</span>
            </template>
            <template #slotOperation="{index,row}">
                <div class="row-op-panel">
                    <a class="row-op" href="javascript:void(0)" @click="dissolutionGroup(row)" v-if="row.status == 1">解散</a>
                </div>
            </template>
        </Table>
    </el-card>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {getCurrentInstance, ref} from "vue";
import Table from "@/components/Table.vue";
import {
    AdminGroupInfoControllerService,
    AdminUserControllerService,
    GroupInfoControllerService
} from "../../../generated";
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
        label: '群头像',
        prop: 'avtar',
        width: 70,
        scopedSlots: 'slotAvatar'
    },
    {
        label: '群名称',
        prop: 'groupName',
        scopedSlots: 'slotGroupName'
    },
    {
        label: '群主',
        prop: 'ownerName',
        scopedSlots: 'slotGroupOwnerNickName'
    },
    {
        label: '群员',
        prop: 'memberCount',
        width: 200
    },
    {
        label: '创建时间',
        prop: 'createTime',
        width: 200
    },
    {
        label: '加入方式',
        prop: 'joinType',
        width: 150,
        scopedSlots: 'slotJoinType'
    },
    {
        label: '状态',
        prop: 'status',
        width: 150,
        scopedSlots: 'slotStatus'
    },
    {
        label: '操作',
        prop: 'operation',
        width: 100,
        scopedSlots: 'slotOperation'
    }
]);
const searchForm = ref({
    groupId: '',
    groupName: '',
    userId: ''
})
const {proxy} = getCurrentInstance()


const loadDataList = async () => {
    let params = {
        current: tableData.value.pageNo,
        pageSize: tableData.value.pageSize
    }
    console.log(searchForm.value)
    Object.assign(params, searchForm.value)
    const result = await AdminGroupInfoControllerService.loadGroupInfoUsingPost(params)
    if (result.code != 0) {
        return
    }
    Object.assign(tableData.value, result.data)
}

const dissolutionGroup = (data) => {
    proxy.Confirm({
        message: `确定要解散群聊【${data.groupName}】吗？`,
        okfun: async () => {
            let result = await GroupInfoControllerService.dismissGroupUsingPost(data.groupId)
            if (result.code !== 0) {
                ElMessage({
                    message: '解散失败请重试',
                    type: 'error',
                })
                return
            }
            ElMessage({
                message: '解散成功',
                type: 'success',
            })
            showDrawer.value = false;
        }
    })
}

</script>

<style scoped>

.el-card {
    margin-bottom: 20px;
}

.row-op{
    color: #2cb6fe;
    text-decoration: none;
    text-align: center;
    display: block;
    margin-top: 10px;
}

</style>