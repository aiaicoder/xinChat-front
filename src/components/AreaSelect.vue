<template>
    <div>
        <el-cascader
                :options="AreaData"
                v-model="modelValue.areaCode"
                @change="change"
                ref="areaSelectRef"
                clearable
        />
    </div>
</template>

<script setup lang="ts">
import AreaData from "@/constant/AreaData";
import {ref} from "vue";

const props = defineProps({
    modelValue: {
        type: Object,
        // eslint-disable-next-line vue/require-valid-default-prop
        default: {}
    }
})

const emit = defineEmits(['update:modelValue'])
const areaSelectRef = ref()
const change = (e: any) => {
    const areaDate = {
        areaName: [],
        areaCode: []
    }
    const checkedNodes = areaSelectRef.value.getCheckedNodes()[0]
    if (!checkedNodes) {
        emit('update:modelValue', areaDate)
        return
    }
    const pathValues = checkedNodes.pathValues;
    const pathLables = checkedNodes.pathLabels;
    areaDate.areaName = pathLables;
    areaDate.areaCode = pathValues;
    emit('update:modelValue', areaDate)
}
</script>

<style scoped>
areaSelect {

}
</style>