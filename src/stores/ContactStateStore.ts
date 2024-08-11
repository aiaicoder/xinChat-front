import {defineStore} from 'pinia'
import {ref} from "vue";

export const ContactSateStore = defineStore('contactSateStore', () => {
    const contactReload = ref( null)
    const  delContactId = ref(null)
    function setContactReload(value: any) {
        contactReload.value = value
    }

    function setDelContactId(value: any) {
        delContactId.value = value
    }

    return {contactReload,delContactId,setContactReload,setDelContactId}
})
