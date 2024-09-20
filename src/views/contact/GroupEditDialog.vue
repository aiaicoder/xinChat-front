<template>
    <Dialog :show="dialogConfig.show"
            :title="dialogConfig.title"
            :buttons="dialogConfig.buttons"
            width="400px"
            :show-cancel="false"
            @close="dialogConfig.show = false"
    >
        <GroupEditForm ref="groupEditRef" @editBack="editBack"></GroupEditForm>
    </Dialog>

</template>

<script setup lang="ts">
import Dialog from "@/components/Dialog.vue";
import GroupEditForm from "@/views/contact/GroupEditForm.vue";
import {nextTick, ref} from "vue";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import {ContactSateStore} from "@/stores/ContactStateStore";

const dialogConfig = ref({
    show: false,
    title: '修改群组',
    buttons: []
})
const groupEditRef = ref();
const show = (data) => {
    //console.log(data)
    dialogConfig.value.show = true;
    nextTick(() => {
        groupEditRef.value.show(data)
    })
}


const emit = defineEmits(['reloadGroupInfo'])
const editBack = () => {
    dialogConfig.value.show = false;
    emit('reloadGroupInfo')
}
defineExpose({
    show
})
</script>

<style scoped>

</style>