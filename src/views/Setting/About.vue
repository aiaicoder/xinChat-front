<template>
    <ContentPanel>
        <el-form ref="formDataRef" label-width="80px" @submit.prevent>
            <el-form-item label="作者">
                <div> 小新</div>
            </el-form-item>
            <el-form-item label="链接">
                <a href="https://github.com/aiaicoder/xinChat-front" class="footer-main-link" target="_blank">GitHub</a>
            </el-form-item>
        </el-form>
    </ContentPanel>
</template>

<script setup lang="ts">
import ContentPanel from "@/components/ContentPanel.vue";
</script>

<style scoped>
.footer-main-link {
    display: block;
    margin: 0;
    line-height: 2;
    font-size: 14px;
    color: #606266
}
</style>