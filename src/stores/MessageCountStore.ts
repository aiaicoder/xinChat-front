import {defineStore} from 'pinia'
import {ref} from "vue";

export const useMessageCountStore = defineStore('messageCountStore', () => {
    const chatCount = ref()
    const contactApplyCount = ref()
    function setChatCount(count: number,forceUpdate: boolean) {
        if (forceUpdate){
            chatCount.value = count
            return
        }
        const oldCount = chatCount.value
        chatCount.value = oldCount + count
    }

    function setContactApplyCount(count: number,forceUpdate: boolean) {
        if (forceUpdate){
            contactApplyCount.value = count
            return
        }
        const oldCount =  contactApplyCount.value
        contactApplyCount.value  = count + oldCount
    }


    return {contactApplyCount,chatCount, setChatCount, setContactApplyCount}
})
