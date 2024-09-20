<template>
    <div>
        <Dialog :show="dialogConfig.show"
                :title="dialogConfig.title"
                :buttons="dialogConfig.buttons"
                width="400px"
                :show-cancel="false"
                @close="dialogConfig.show = false"
        >
            <el-form
                    :model="formData"
                    :rules="rules"
                    ref="formDataRef"
                    @submit.prevent
            >
                <el-form-item label="" prop="">
                    <el-input
                            type="textarea"
                            :rows="5"
                            clearable
                            placeholder="请输入申请信息, 更容易被通过"
                            v-model.trim="formData.applyInfo"
                            resize="none"
                            show-word-limit
                            maxlength="100"
                    ></el-input>
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import Dialog from "@/components/Dialog.vue";
import {nextTick, reactive, ref} from "vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import {UserContactControllerService} from "../../../generated";
import {ElMessage} from "element-plus";
import {ContactSateStore} from "@/stores/ContactStateStore";

const contactStore = ContactSateStore();
const loginUse = useLoginUserStore()
const dialogConfig = ref({
    show: false,
    title: '提交申请',
    buttons: [
        {
            type: 'primary',
            text: '确定',
            click: () => {
                submitApply()
            }
        },
    ]
})
const formDataRef = ref();
const formData = ref({})
const rules = reactive({})

const emit = defineEmits(['reload'])
const submitApply = async () => {
    const res = await UserContactControllerService.applyAddUsingPost(formData.value)
    if (res.code === 0 && res.data === 0) {
        ElMessage({
            message: "添加成功",
            type: "success",
        })
        contactStore.setContactReload(formData.value.contactType)

    }else if (res.code === 0 && res.data === 1) {
        ElMessage({
            message: "申请成功，等待对方同意",
            type: "success",
        })
    }
    dialogConfig.value.show = false
    emit('reload')
}
const show = (data: any) => {
    dialogConfig.value.show = true
    nextTick(() => {
        formDataRef.value.resetFields()
        formData.value = Object.assign({}, data)
        formData.value.applyInfo = '我是' + loginUse.loginUser.userName
    })
}
defineExpose({
    show
})

</script>

<style scoped>

</style>