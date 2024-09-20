<template>
    <div class="form-panel">
        <el-form ref="formDataRef" :rules="rules" :model="formData" label-width="160px" @submit.prevent>
            <el-form-item label="最多可创建组数" prop="maxGroupCount">
                <el-input
                        clearable
                        placeholder="请输入每个人最多可创建群组数"
                        v-model.trim="formData.maxGroupCount"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="群组最大成员数" prop="maxGroupMemberCount">
                <el-input
                        clearable
                        placeholder="请输入每个群组最大成员数"
                        v-model.trim="formData.maxGroupMemberCount"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="图片大小" prop="maxImageSize">
                <el-input
                        clearable
                        placeholder="请输入允许上传的图片大小"
                        v-model.trim="formData.maxImageSize"
                >
                    <template #append>MB</template>
                </el-input>
            </el-form-item>
            <el-form-item label="视频大小" prop="maxVideoSize">
                <el-input
                        clearable
                        placeholder="请输入允许上传的视频大小"
                        v-model.trim="formData.maxVideoSize"
                >
                    <template #append>MB</template>
                </el-input>
            </el-form-item>
            <el-form-item label="其他文件大小" prop="maxFileSize">
                <el-input
                        clearable
                        placeholder="请输入允许上传的视频大小"
                        v-model.trim="formData.maxFileSize"
                >
                    <template #append>MB</template>
                </el-input>
            </el-form-item>
            <el-form-item label="机器人名称" prop="robotNickName">
                <el-input
                        clearable
                        placeholder="请输入机器人名称"
                        v-model.trim="formData.robotNickName"
                        maxlength="20"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="机器人头像" prop="robotAvatar">
                <AvatarUpload :mode-value="formData.robotAvatar" @coverFile="savaCover"></AvatarUpload>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="savaSetting">保存设置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {AdminSettingControllerService, UserControllerService} from "../../../generated";
import AvatarUpload from "@/components/AvatarUpload.vue";

const {proxy} = getCurrentInstance();
const formDataRef = ref();
const formData = ref({});

const rules = {
    maxGroupCount: [
        {required: true, message: '请输入最多可创建群组数'},
        {validator: proxy.Verify.number, message: '必须为数字'}
    ],
    maxGroupMemberCount: [
        {required: true, message: '请输入每个群组最大成员数'},
        {validator: proxy.Verify.number, message: '必须为数字'}
    ],
    maxImageSize: [
        {required: true, message: '请输入允许上传的图片大小'},
        {validator: proxy.Verify.number, message: '必须为数字'}
    ],
    maxVideoSize: [
        {required: true, message: '请输入允许上传的视频大小'},
        {validator: proxy.Verify.number, message: '必须为数字'}
    ],
    maxFileSize: [
        {required: true, message: '请输入允许上传的其他文件大小'},
        {validator: proxy.Verify.number, message: '必须为数字'}
    ],
    robotNickName: [
        {required: true, message: '请输入机器人名称'}
    ]
}

const savaCover = (robotAvatarBack) => {
    formData.value.robotAvatar = robotAvatarBack
}

const getSetting = async () => {
    let result = await AdminSettingControllerService.getSysSettingUsingGet()
    if (result.code !== 0) {
        ElMessage({
            message: '获取设置失败',
            type: 'error',
        })
        return
    }
    formData.value = result.data
}

const savaSetting = async () => {
    formDataRef.value.validate(async (valid) =>{
        if (!valid) {
            return
        }
        let params = {}
        Object.assign(params, formData.value)
        let result = await AdminSettingControllerService.updateSysSettingUsingPost(params)
        if (result.code !== 0) {
            ElMessage({
                message: '保存设置失败',
                type: 'error',
            })
            return
        }
        ElMessage({
            message: '保存设置成功',
            type: 'success',
        })
    })
}
onMounted(() =>{
    getSetting()
})
</script>

<style lang="scss" scoped>
.form-panel {
  height: calc(100vh - 63px);
}
</style>