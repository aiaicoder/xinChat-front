<template>
    <div class="image-panel">
        <el-image :src="props.avatar" fit="scale-down" :width="width" :preview-src-list="showDetail ? [props.avatar] : null">
            <template #error>
                <div class="iconfont icon-image-error"></div>
            </template>
        </el-image>
        <div class="play-panel" v-if="showPlay" @click="toggleVideoDialog">
            <span class="iconfont icon-video-play"></span>
        </div>
        <div class="video-overlay" v-show="dialogVideoVisible">
            <div class="video-container" ref="dplayerContainer"></div>
            <span class="iconfont icon-close" @click="closeVideoDialog"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import DPlayer from 'dplayer';

const props = defineProps({
    width: {
        type: Number,
        default: 170
    },
    showPlay: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: [String]
    },
    partType: {
        type: String,
        default: 'avatar'
    },
    fileType: {
        type: Number,
        default: 0
    },
    showDetail: {
        type: Boolean,
        default: false
    },
    videoUrl:{
        type: String,
        default: ''
    }
})

// const print = () => {
//     //console.log(props.avatar)
// }
// print()


const dialogVideoVisible = ref(false);
const dplayerContainer = ref(null);
let dp = null; // 保存 DPlayer 实例

// 初始化 DPlayer
const initDPlayer = () => {
    const container = dplayerContainer.value;
    dp = new DPlayer({
        container: container,
        video: {
            url: props.videoUrl,
            pic: props.avatar, // 视频封面图片
        },
        hotkey: true,
        autoplay: true,
        preload: 'auto',
        playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
    });
};

// 切换视频对话框显示状态
// 切换视频对话框显示状态
const toggleVideoDialog = () => {
    dialogVideoVisible.value = true;
    initDPlayer();
};

// 关闭视频对话框
const closeVideoDialog = () => {
    dialogVideoVisible.value = false;
    if (dp) {
        dp.destroy();
        dp = null;
    }
};

// 监听 dialogVideoVisible 变化
watch(dialogVideoVisible, (newVal) => {
    if (!newVal && dp) {
        // 对话框关闭时销毁 DPlayer
        dp.destroy();
        dp = null;
    }
});

</script>

<style lang="scss" scoped>
.image-panel {
  position: relative;
  display: flex;
  overflow: hidden;
  cursor: pointer;
  max-width: 170px;
  background: #ddd;

  .icon-image-error {
    margin: 0 30px;
    font-size: 30px;
    color: #838383;
  }

  .play-panel {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .icon-video-play {
      font-size: 35px;
      color: #fff;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}
.video-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .video-container {
        width: 80%;
        height: 80%;
    }

    .icon-close {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 30px;
        color: #fff;
        cursor: pointer;
    }
}
</style>