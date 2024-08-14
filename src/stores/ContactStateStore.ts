import {defineStore} from 'pinia'
import {ref} from "vue";

export const ContactSateStore = defineStore('contactSateStore', () => {
    const contactReload = ref( null)
    function setContactReload(value: any) {
        contactReload.value = value
    }


    return {contactReload,setContactReload,}
})
