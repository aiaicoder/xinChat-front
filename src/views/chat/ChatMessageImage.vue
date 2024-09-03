<template>
    <ShowImage :avatar="data.fileUrl || data.filePath" part-type="chat"
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
const print = () => {
    console.log(props.data)
}
</script>

<style scoped>
chatMessageImage {

}
</style>