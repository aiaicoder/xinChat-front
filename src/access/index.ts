import router from "@/router";

import Access_Enum from "@/access/ACCESS_ENUM";

import checkAccess from "@/access/checkAccess";
import {useLoginUserStore} from "@/stores/UseLoginUserStore";
import wsClient from "@/webSocket/wsClient";

let wsInit = false;
router.beforeEach(async (to, from, next) => {
    const loginStore = useLoginUserStore();
    //自动登录
    let loginUser = loginStore.loginUser
    //如果用户不存在,先自动登录
    if (!loginUser || loginUser.userRole === Access_Enum.UnLogin) {
        //同步等待用户登录成功
        await loginStore.fetchLoginUser();
        loginUser = loginStore.loginUser;
        if (loginUser && !wsInit){
            wsInit = true;
            wsClient.initWs({token: loginUser.token})
        }
    }
    //根据路由中的meta信息进行判断，如果没有access属性那么就表示该页面无需登录
    const needAccess = (to.meta?.access as string) ?? Access_Enum.UnLogin;
    //表明该页面需要登录
    if (needAccess !== Access_Enum.UnLogin) {
        //如果用户未登录
        if (!loginUser || loginUser.userRole === Access_Enum.UnLogin) {
            next(`/user/login?redirect=${to.fullPath}`)
        }
        //如果已经登录但是权限不足
        if (!checkAccess(loginUser, needAccess)) {
            next("/noAuth");
            return;
        }
    }
    next();
});
