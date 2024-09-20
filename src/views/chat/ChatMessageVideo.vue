<template>
    <ShowImage :avatar="data.videoCoverUrl" part-type="chat"
               :file-type="data.fileType" :show-play="true" :video-url="data.filePath || data.fileUrl || data.messageContent"></ShowImage>
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
})

const print = () => {
    //console.log(props.data)
}
print()
</script>

<style scoped>
chatMessageImage {

}
</style>