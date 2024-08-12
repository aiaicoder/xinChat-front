<template>
    <div class="avatar-upload">
        <div class="avatar-show">
            <template v-if="modeValue">
                <el-image v-if="preview" :src="picUrl" fit="scale-down">

                </el-image>
                <ShowImage
                        :file-id="props.modeValue"
                        part-type="avatar"
                        :width="40"
                        v-else
                ></ShowImage>
            </template>
            <template v-else>
                <el-upload
                        name="file"
                        :show-file-list="false"
                        accept=".png,.PNG,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                        :multiple="false"
                        :http-request="uploadImage"
                >
                    <span class="iconfont icon-add"></span>
                </el-upload>
            </template>
        </div>

        <div class="select-btn">
            <el-upload
                    name="file"
                    :show-file-list="false"
                    accept=".png,.PNG,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                    :multiple="false"
                    :http-request="uploadImage"
            >
                <el-button type="primary" size="small">选择</el-button>
            </el-upload>
        </div>
    </div>
</template>

<script setup lang="ts">
import ShowImage from "@/components/ShowImage.vue";
import {ref} from "vue";
import {FileControllerService} from "../../generated";

const preview = ref(true)
const picUrl = ref('')
const emit = defineEmits(['coverFile'])
const props = defineProps({
    modeValue: {
        type: [String, Object],
        default: null
    }
})
const uploadImage = async (file) => {
    const res = await FileControllerService.uploadAvatarUsingPost(file.file, "user_avatar")
    if (res.code === 0) {
        preview.value = false
        picUrl.value = res.data
        emit("coverFile", res.data)
    }

}
</script>

<style scoped>
.avatar-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: normal;

    .avatar-show {
        background: #ededed;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;

        .icon-add {
            font-size: 30px;
            color: #b9b9b9;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
        }

        img {
            width: 100%;
            height: 100%;
        }

        .op {
            position: absolute;
            color: #0e8aef;
            top: 80px;
        }
    }

    .select-btn {
        vertical-align: bottom;
        margin-left: 5px;
    }
}
</style>