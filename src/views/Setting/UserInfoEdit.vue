<template>
    <div>
        <el-form ref="formDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
            <el-form-item label="头像" prop="userAvatar">
                <AvatarUpload :mode-value="formData.userAvatar" @coverFile="coverFile"></AvatarUpload>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input maxlength="30" clearable placeholder="请输入新的昵称"
                          v-model.trim="formData.userName"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="formData.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="朋友权限" prop="joinType">
                <el-switch v-model="formData.joinType" :active-value="1" :inactive-value="0">
                    <div class="info">加我为好友需要验证</div>
                </el-switch>
            </el-form-item>
            <el-form-item label="地区" prop="area">
                <area-select v-model="formData.area"></area-select>
            </el-form-item>
            <el-form-item>
                <el-input
                        clearable
                        placeholder="请输入个性签名"
                        v-model.trim="formData.userProfile"
                        type="textarea"
                        :show-word-limit="true"
                        rows="5"
                        maxlength="30"
                        resize="none"
                >
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveUserInfo">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {computed, getCurrentInstance, ref} from "vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import AvatarUpload from "@/components/AvatarUpload.vue";
import AreaSelect from "@/components/AreaSelect.vue";
import {UserControllerService} from "../../../generated";
import {ElMessage} from "element-plus";

const formDataRef = ref()
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const coverFile = (userAvatar) => {
    formData.value.userAvatar = userAvatar
}
const formData = ref({
    ...props.data
})
const useLogin = useLoginUserStore()
const {proxy} = getCurrentInstance()
const router = useRouter()
const rules = {
    userName: [
        {required: true, message: '请输入新的昵称'},
    ],
}

const emit = defineEmits(['emitBack'])
const saveUserInfo = () => {
    formDataRef.value.validate(async valid => {
        if (!valid) {
            return
        }
        let params = {}
        Object.assign(params, formData.value)
        if (params.area) {
            params.areaCode = params.area.areaCode.join(',')
            params.areaName = params.area.areaName.join(',')
            delete params.area
        }
        const res = await UserControllerService.updateMyUserUsingPost(params)
        if (res.code !== 0) {
            ElMessage.error(res.message)
            return
        }
        ElMessage.success('更新成功')
        formDataRef.value.resetFields()
        useLogin.setLoginUser(res.data);
        emit('emitBack')

    })
}
const cancel = () => {
    emit('emitBack')
}
</script>

<style scoped>
.info {
    margin-left: 5px;
    color: #949494;
    font-size: 12px;
}
</style>