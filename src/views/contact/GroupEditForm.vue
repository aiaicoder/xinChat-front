<template>
    <div class="groupCreate">
        <el-form
            class="login-register"
            ref="ruleFormRef"
            :model="formData"
            status-icon
            :rules="rules"
            label-width="80px"
            @submit.prevent
        >
            <el-form-item label="群名称">
                <el-input
                    maxlength="150"
                    clearable
                    placeholder="请输入群名称"
                    v-model.trim="formData.groupName"
                ></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="avatarFile">
                <AvatarUpload
                    v-model="formData.groupAvatar"
                    ref="avatarUploadRef"
                    @coverFile="getPicUrl"
                >
                </AvatarUpload>
            </el-form-item>
            <el-form-item>
                <el-radio-group v-model="formData.joinType">
                    <el-radio :label="1">管理员同意后加入</el-radio>
                    <el-radio :label="0">直接加入</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-input
                    clearable
                    placeholder="请输入群公告"
                    v-model.trim="formData.groupNotice"
                    type="textarea"
                    :show-word-limit="true"
                    rows="5"
                    maxlength="300"
                    resize="none"
                >
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">
                    {{formData.groupId ? '修改群组' : '创建群组'}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {GroupInfoControllerService} from "../../../generated";
import {ElMessage} from "element-plus";
import {ContactSateStore} from "@/stores/ContactStateStore";
import AvatarUpload from "@/components/AvatarUpload.vue";

const contactStore = ContactSateStore();
const formData = ref({})
const ruleFormRef = ref()
const rules = {
    groupName: [
        {required: true, message: '请输入群名称'},
    ],
    joinType:[{required: true, message: '请选择加入权限'}]
}
const emit = defineEmits(['editBack'])
const submit = () => {
    ruleFormRef.value.validate( async valid => {
        if (!valid) {
            return
        }
        const res = await GroupInfoControllerService.saveGroupUsingPost1(formData.value)
        if (res.code !== 0){
            ElMessage.error(res.message)
            return
        }
        if (formData.value.groupId) {
            ElMessage.success('修改群组成功')
            emit('editBack')
        } else {
            ElMessage.success("创建群组成功")
        }
        ruleFormRef.value.resetFields()
        contactStore.setContactReload("MY")
        //todo 重新加载头像
    })
}
const getPicUrl = (url: string) =>{
    formData.value.groupAvatar = url
}
</script>

<style lang="scss" scoped>
.groupCreate {
    width: 100%;
}
</style>