import {ref} from 'vue'
import {defineStore} from 'pinia'
// @ts-ignore
import {UserControllerService} from "../../generated";
import Access_Enum from "@/access/ACCESS_ENUM";
import wsClient from "@/webSocket/wsClient";
import {useRouter} from "vue-router";
import ChatSessionModel from "@/db/ChatSessionModel";


export const useLoginUserStore = defineStore('loginUser', () => {
    const router = useRouter()
    const loginUser = ref({
        id: "",
        userName: "未登录",
        userRole: "notLogin",
        userAvatar: "",
        sex: "",
        userProfile: "",
        createTime: "",
        token: "",
    })

    async function fetchLoginUser() {
        const res = await UserControllerService.getLoginUserUsingGet()
        if (res.code == 0 && res.data) {
            // //console.log("获取用户信息成功", res.data)
            loginUser.value = res.data
        }

    }

    async function logout() {
        const res = await UserControllerService.userLogoutUsingPost()
        if (res.code == 0) {
            setLoginUser({
                ...loginUser,
                userRole: Access_Enum.UnLogin,
            })
            wsClient.closeWs()
            await ChatSessionModel.clearAll()
            router.push("/user/login")
        }
    }

    function setLoginUser(newLoginUser: any) {
        loginUser.value = newLoginUser
    }

    return {loginUser, fetchLoginUser, setLoginUser, logout}

})
