import {defineStore} from 'pinia';
import {ref} from "vue";

export const useChatStore = defineStore('chat', () => {
    const messageType = ref(null);

    function setMessageType(value: any) {
        messageType.value = value
    }

    return {setMessageType,messageType}
});