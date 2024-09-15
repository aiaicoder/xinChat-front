<template>
    <div class="userAvatar" @click="showDetailHandler"
         :style="{width:width + 'px',height: width + 'px','border-radius':borderRadius + 'px'}"
    >
        <showImage :width="width" :avatar="avatar" partType="avatar" :force-get="true" ></showImage>
    </div>
</template>

<script setup lang="ts">
import ShowImage from "@/components/ShowImage.vue";

const props = defineProps({
    userId: {
        type: String,
    },
    width: {
        type: Number,
        default: 40
    },
    borderRadius: {
        type: Number,
        default: 0
    },
    showDetail: {
        type: Boolean,
        default: false
    },
    avatar:{
        type: String,
        default: ''
    }
})
const showDetailHandler = () => {
    if (!props.showDetail) {
        return;
    }
}
</script>

<style lang="scss" scoped>
.userAvatar {
  background: #d3d3d3;
  display: flex;
  overflow: hidden;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
</style>