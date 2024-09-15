<template>
    <Dialog :show="dialogConfig.show"
            :title="dialogConfig.title"
            :buttons="dialogConfig.buttons"
            width="400px"
            @close="dialogConfig.show = false"
    >
        <el-form ref="formDataRef" :model="formData" :rules="rules" label-width="60px">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model.trim="formData.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="靓号" prop="id">
                <el-input :maxlength='11' v-model.trim="formData.userId" placeholder="请输入靓号"></el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup lang="ts">
import Dialog from "@/components/Dialog.vue";

import {getCurrentInstance, nextTick, ref} from "vue";
import {AdminUserBeautyControllerService} from "../../../generated";

const {proxy} = getCurrentInstance()
const dialogConfig = ref({
    show: false,
    title: '编辑靓号',
    buttons: [
        {
            text: '确定',
            type: 'primary',
            click: async () => {
                await submitForm()
            }
        }
    ]
})
const formData = ref({updateDescList: []})
const formDataRef = ref()
const rules = ref({
    email: [
        {required: true, message: '请输入邮箱', trigger: 'blur'},
        {validator: proxy.Verify.email, trigger: 'blur', message: '请输入正确的邮箱'}
    ],
    userId: [
        {required: true, message: '请输入靓号'},
        {min: 11, max: 11, message: '靓号长度为11位'},
        {validator: proxy.Verify.number, trigger: 'blur', message: '靓号只能为数字'}
    ]
})

const emit = defineEmits(['reload'])
const submitForm = async () => {
    formDataRef.value.validate(
        async (valid) => {
            if (!valid) {
                return
            }
            let params = {
                ...formData.value
            }
            const result = await AdminUserBeautyControllerService.addUserUsingPost(params)
            if (result.code != 0) {
                return
            }
            dialogConfig.value.show = false
            emit('reload')
        }
    )
}

const showEdit = (data = {}) => {
    dialogConfig.value.show = true
    nextTick(() => {
        formDataRef.value.resetField()
        //@ts-ignore
        formData.value = Object.assign({}, data)
    })
}

defineExpose({showEdit})
</script>

<style scoped>
beautyAccountEdit {

}
</style>