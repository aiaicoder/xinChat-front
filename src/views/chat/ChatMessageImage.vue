<template>
    <ShowImage :avatar="FileUrl()" part-type="chat"
               :file-type="data.fileType" :show-detail="showDetail"></ShowImage>
</template>

<script setup lang="ts">
import ShowImage from "@/components/ShowImage.vue";
import CosConstant from "@/constant/CosConstant";

const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    },
    showDetail: {
        type: Boolean,
        default: false
    }
})
const FileUrl = () => {
    if (props.data.fileUrl) {
        return props.data.fileUrl
    } else if (props.data.filePath) {
        return props.data.filePath
    } else {
        return props.data.messageContent
    }
}

</script>

<style scoped>
chatMessageImage {

}
</style>