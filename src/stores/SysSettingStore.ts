import {defineStore} from 'pinia'
import {ref} from "vue";

export const SystemSettingStore = defineStore('systemSettingStore', () => {
    const sysSetting = ref({})
    function setSysSetting(value: any) {
        sysSetting.value = value
    }


    return {sysSetting,setSysSetting,}
})
