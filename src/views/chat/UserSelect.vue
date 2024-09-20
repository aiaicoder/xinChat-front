<template>
    <div>
        <Dialog
                :title="dialogConfig.title"
                :show="dialogConfig.show"
                width="660px"
                @close="dialogConfig.show = false"
                :buttons="dialogConfig.buttons"
        >
            <el-transfer
                    v-model="formData.selectContacts"
                    :titles="['全部','已选']"
                    :format="{
                      noChecked: '${total}',
                      hasChecked: '${checked}/${total}'
                  }"
                    :data="dataList"
                    :props="{
                       key: 'contactId',
                      label: 'contactName',
                  }"
                    filterable
                    :filter-method="search"
            >
                <template #default="{option}">
                    <div class="select-item">
                        <div class="avatar">
                            <AvatarBase
                                    :avatar="option.avatar"
                                    :width="30"
                                    :border-radius="5"
                                    :show-detail="false"
                            >
                            </AvatarBase>
                        </div>
                        <div class="nick-name">{{ option.contactName }}</div>
                    </div>
                </template>
            </el-transfer>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import Dialog from "@/components/Dialog.vue";
import AvatarBase from "@/components/AvatarBase.vue";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {GroupInfoControllerService} from "../../../generated";

const dialogConfig = ref({
    title: '选择联系人',
    show: false,
    buttons: [
        {
            text: '确定',
            type: 'primary',
            click: () => {
                submitData()
            }
        }
    ]
})

const search = (query: string, item: any) => {
    return item.contactName.toLowerCase().includes(query.toLowerCase())
}

const dataList = ref([])
const formData = ref({
    selectContacts: []
})

const show = ({contactList, groupId, opType}) => {
    //console.log(contactList)
    dialogConfig.value.title = opType === 0 ? '移除群员' : '添加群员'
    dialogConfig.value.show = true
    dataList.value = contactList
    formData.value = {
        selectContacts: [],
        groupId: groupId,
        opType: opType
    }
}

defineExpose({show})
const emit = defineEmits(['callBack'])
const submitData = async () => {
    if (formData.value.selectContacts.length == 0) {
        ElMessage.warning('请选择联系人')
        return
    }
    let params = {}
    Object.assign(params, formData.value)
    params.selectContactIds = formData.value.selectContacts.join(',')
    delete params.selectContacts;
    let result = await GroupInfoControllerService.addOrRemoveGroupMemberUsingPost(params)
    if (result.code !== 0) {
        return
    }
    dialogConfig.value.show = false
    emit('callBack')

}
</script>

<style scoped>

.el-transfer {
    width: 100%;
    display: block !important;
    display: flex;

    :deep(.el-transfer-panel) {
        width: 280px;
    }

    :deep(.el-transfer-panel__item) {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 5px;
    }

    :deep(.el-transfer-panel__buttons) {
        width: 60px;
        flex-direction: column;
        text-align: center;
        padding: 0;

        .el-transfer__button {
            text-align: center;
            margin-left: 0;
            margin-right: 0;
            margin-top: 5px;
            padding: 10px;
            height: 36px;
            border-radius: 50%;
        }
    }
}

.select-item {
    display: flex;

    .avatar {
        width: 40px;
        height: 40px;
    }

    .nick-name {
        flex: 1;
        margin-left: 5px;
    }
}
</style>