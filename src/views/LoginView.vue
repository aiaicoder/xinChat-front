<template>
    <div class="login-body">
        <div class="bg">
            <div class="login-panel">
                <el-form
                        class="login-register"
                        ref="formDataRef"
                        :model="formData"
                        status-icon
                        :rules="rules"
                >
                    <div class="login-title">xinChat</div>
                    <el-form-item label="邮箱" prop="email">
                        <el-input size="large" v-model.trim="formData.email" type="text" placeholder="请输入邮箱">
                            <template #prefix>
                                <span class="iconfont icon-email"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                                v-model="formData.password"
                                type="password"
                                placeholder="请输入密码"
                                size="large"
                                show-password
                        >
                            <template #prefix>
                                <span class="iconfont icon-password"></span>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="验证码" prop="checkCode">
                        <div class="check-code-panel">
                            <el-input size="large" v-model.trim="formData.checkCode" type="text"
                                      placeholder="请输入验证码">
                                <template #prefix>
                                    <span class="iconfont icon-checkCode"></span>
                                </template>
                            </el-input>
                            <img :src=checkCodeUrl class="check-code" @click="getCheckCode" alt="图片验证码"/>
                        </div>

                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="large"
                                   class="op-btn">
                            登录
                        </el-button>
                    </el-form-item>
                    <div class="no-account">
                        <span class="a-link">还没有账号？</span>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {FormRules} from 'element-plus'
import {UserControllerService} from "../../generated";
import {ElMessage} from 'element-plus'

const formDataRef = ref()
const formData = reactive({
    email: '',
    password: '',
    checkCode: '',
})
const rules = reactive<FormRules<typeof formData>>({
    email: [{required: true, message: '请输入邮箱'}],
    password: [{required: true, message: '请输入密码'}]
})
const checkCodeUrl = ref()
const checkCodeKey = ref()

//页面加载的时候先获取验证码
onMounted(() => {
    getCheckCode();
})
const getCheckCode = async () => {
    const result = await UserControllerService.checkCodeUsingGet1()
    if (result.code == 0) {
        checkCodeUrl.value = result.data.checkCode;
        checkCodeKey.value = result.data.checkCodeKey;
    } else {
        ElMessage({
            message: result.message,
            type: 'error',
        })
    }
}


</script>

<style scoped lang="scss">
.login-body {
  height: calc(100vh);
  background-size: cover;
  display: flex;
  background: url("../assets/Broken Hearts.jpg") no-repeat;
}

.bg {
  flex: 1;
  background-size: cover;
  background: url("../assets/undraw_online_chat_re_c4lx.svg") no-repeat center;
}

.login-panel {
  width: 430px;
  margin-left: 70%;
  margin-top: calc((100vh - 500px) / 2);

}


.login-register {
  padding: 25px;
  background: #ffffff;
  border-radius: 5px;
}

.login-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.send-mail-panel {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.send-mail-btn {
  margin-left: 5px;
}

.rememberMe-panel {
  width: 100%;
}

.no-account {
  width: 100%;
  display: flex;
  margin-left: 80%;
  justify-content: space-between;
}

.op-btn {
  width: 100%;
}

.check-code-panel {
  width: 100%;
  display: flex;
}


.check-code {
  margin-left: 5px;
  cursor: pointer;
  height: 38px;
  width: 130px;
}

.login-btn-qq {
  margin-top: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  cursor: pointer;
  margin-left: 10px;
  width: 20px;
}
</style>