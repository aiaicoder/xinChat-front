<template>
    <div class="login-body">
        <div class="bg">
            <div class="login-panel">
                <el-form
                        class="login-register"
                        ref="ruleFormRef"
                        :model="formData"
                        status-icon
                        :rules="rules"
                        @submit.prevent
                >
                    <div class="login-title">xinChat</div>
                    <el-form-item prop="email">
                        <el-input size="large" v-model.trim="formData.email" type="text" placeholder="请输入邮箱">
                            <template #prefix>
                                <span class="iconfont icon-email"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <!--登录密码，注册密码，找回密码-->
                    <el-form-item prop="password" v-if="opType == 1">
                        <el-input
                                v-model.trim="formData.password"
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
                    <!--注册密码，重置密码-->
                    <el-form-item prop="password" v-if="opType ==0 || opType == 2">
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
                    <!--确认密码-->
                    <el-form-item prop="checkPassword" v-if="opType == 0 || opType == 2">
                        <el-input
                                v-model.trim="formData.checkPassword"
                                type="password"
                                placeholder="请确认密码"
                                size="large"
                                show-password
                        >
                            <template #prefix>
                                <span class="iconfont icon-password"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="checkCode">
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
                    <el-form-item v-if="opType == 1">
                        <div class="rememberMe-panel">
                            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
                        </div>
                        <div class="no-account">
                            <a href="javascript:void(0)" class="a-link" @click="showPanel(2)">忘记密码?</a>
                            <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">还没有账号?</a>
                        </div>
                    </el-form-item>
                    <!--找回密码-->
                    <el-form-item v-if="opType == 2">
                        <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">去登陆?</a>
                    </el-form-item>
                    <!-- 注册-->
                    <el-form-item v-if="opType == 0">
                        <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有账号?</a>
                    </el-form-item>
                    <el-form-item
                    >
                        <el-button type="primary" size="large" class="op-btn" @click="submitForm(ruleFormRef)">
                            <span v-if="opType == 0">注册</span>
                            <span v-if="opType == 1">登录</span>
                            <span v-if="opType == 2">重置密码</span>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive, ref} from 'vue'
import {UserControllerService} from "../../generated";
import {ElMessage, FormInstance} from 'element-plus'
import router from "@/router";

//获取组件的代理对象
const {proxy} = getCurrentInstance()
const ruleFormRef = ref<FormInstance>()

//操作类型 0:注册，1:登录，2:修改密码
const opType = ref(1)
//切换展示样式
const showPanel = (type) => {
    //切换的时候重置表单
    restForm();
    opType.value = type;
}

//图片base64
const checkCodeUrl = ref()
//校验图片验证
const checkCodeKey = ref()
//获取验证码
const getCheckCode = async () => {
    const result = await UserControllerService.checkCodeUsingGet()
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
//页面加载的时候先获取验证码
onMounted(() => {
    getCheckCode();
})


const formData = reactive({
    email: '',
    password: '',
    checkPassword: '',
    checkCode: '',
    checkCodeKey: checkCodeKey,
    rememberMe: false
})

//密码校验
const checkResetPassword = (rule, value, callback) => {
    if (value != formData.password) {
        console.log(formData.password)
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

const rules = reactive({
    email: [{required: true, message: '邮箱不能为空'},
        {validator: proxy.Verify.email, message: "邮箱格式不正确"}
    ],
    password: [{required: true, message: '密码不能为空'},
        {validator: proxy.Verify.password, message: "密码长度至少为8位"}
    ],
    checkPassword: [{required: true, message: '密码不能为空'},
        {validator: checkResetPassword, message: "密码不一致"}
    ],
    checkCode: [{required: true, message: '验证码不能为空'}]
})

//用户注册
const register = async () => {
    const res = await UserControllerService.userRegisterUsingPost(formData)
    if (res.code == 0) {
        if (res.data?.token) {
            localStorage.setItem("xinChat-token", res.data.token);
        }
        ElMessage({
            message: "注册成功，赶快去登录吧",
            type: 'success',
        })
        showPanel(1);
    } else {
        ElMessage({
            message: res.message,
            type: 'error',
        })
    }
}


//用户登录
const login = async () => {
    const res = await UserControllerService.userLoginUsingPost(formData)
    if (res.code == 0) {
        if (res.data?.token) {
            const expiration = Date.now() + 7 * 1000; // 过期时间戳
            localStorage.setItem('xinChat-token', res.data.token);
            localStorage.setItem('xinChat-token-expiration', String(expiration));
        }
        ElMessage({
            message: "登录成功",
            type: 'success',
        })
        await router.push("/")
    } else {
        ElMessage({
            message: res.message,
            type: 'error',
        })
    }
}

//重置密码
const resetPassword = async () => {
    const res = await UserControllerService.resetPasswordUsingPost(formData);
    if (res.code === 0) {
        ElMessage({
            message: "重置密码成功",
            type: 'success',
        });
    } else {
        ElMessage({
            message: res.message,
            type: 'error',
        });
    }
};

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            switch (opType.value) {
                case 0:
                    register();
                    break;
                case 1:
                    login();
                    break;
                case 2:
                    resetPassword();
                    break;
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
//重置表单
const restForm = () => {
    getCheckCode();
    ruleFormRef.value?.resetFields()
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