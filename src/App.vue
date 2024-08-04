<script setup lang="ts">
import {RouterView} from 'vue-router'
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {reactive} from "vue";

const local = zhCn;
const config = reactive({
    max: 1
})
</script>

<template>
    <header>
        <el-config-provider :locale="zhCn">
            <RouterView></RouterView>
        </el-config-provider>
    </header>
</template>

<style scoped>

</style>
