<template>
    <div>
        <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
            <el-form-item prop="password"  label="新密码">
                <el-input
                    v-model="formData.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password

                >
                </el-input>
            </el-form-item>
            <!--确认密码-->
            <el-form-item prop="checkPassword"  label="确认密码">
                <el-input
                    v-model.trim="formData.checkPassword"
                    type="password"
                    placeholder="请确认密码"
                    show-password
                >
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveUserInfo">修改密码</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref} from "vue";
import {UserControllerService} from "../../../generated";
import {ElMessage} from "element-plus";
import router from "@/router";

const formDataRef = ref()
const formData = reactive({
    password: '',
    checkPassword: ''
})
const {proxy} = getCurrentInstance()


const checkResetPassword = (rule, value, callback) => {
    if (value != formData.password) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

const rules = reactive({
    password: [{required: true, message: '密码不能为空'},
        {validator: proxy.Verify.password, message: "密码长度至少为8位"}
    ],
    checkPassword: [{required: true, message: '密码不能为空'},
        {validator: checkResetPassword, message: "密码不一致"}
    ],
})

const emit = defineEmits(['emitBack'])
const saveUserInfo = () => {
    formDataRef.value.validate(async valid => {
        if (!valid) {
            return
        }
        proxy.Confirm(
            {
                message: '修改密码后将退出,需重新登录,确定要修改吗',
                okfun: async () => {
                    const res = await UserControllerService.updatePasswordUsingPost(formData)
                    if (res.code === 0) {
                        ElMessage.success('修改成功')
                        router.push("/user/login")
                    } else {
                        ElMessage.error(res.message)
                    }
                }
            }
        )
    })
}
const cancel = () => {
    emit('emitBack')
}
</script>

<style scoped>
</style>