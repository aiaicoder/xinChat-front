import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
// @ts-ignore
import {UserControllerService} from "../../generated";
import Access_Enum from "@/access/ACCESS_ENUM";


export const useLoginUserStore = defineStore('loginUser', () => {

    const loginUser = ref({
        id: "",
        userName: "未登录",
        userRole: "notLogin",
        userAvatar: "",
        sex: "",
        userProfile: "",
        createTime: "",
    })

    async function fetchLoginUser() {
        const res = await UserControllerService.getLoginUserUsingGet()

        if (res.code == 0 && res.data) {
            console.log("获取用户信息成功", res.data)
            loginUser.value = res.data
        }

    }

    function setLoginUser(newLoginUser: any) {
        loginUser.value = newLoginUser
    }

    return {loginUser, fetchLoginUser, setLoginUser}

})