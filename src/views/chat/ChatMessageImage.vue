<template>
    <ShowImage :avatar="data.fileUrl || CosConstant+data.filePath" part-type="chat"
               :file-type="data.fileType"></ShowImage>
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
    console.log(props.data)
}
print()
</script>

<style scoped>
chatMessageImage {

}
</style>