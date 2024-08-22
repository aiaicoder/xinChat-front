import axios from "axios";
import {ElLoading} from "element-plus";
// 定义常量来避免硬编码，方便后期维护
const UNAUTHORIZED_CODES = new Set([40100, 40101, 40102, 40103, 40104]);
const LOGIN_REQUEST_URL = "user/get/login";
const LOGIN_PAGE_PATH = "user/login";


// @ts-ignore
const debounce = (fn, t) => {
    //2,3,4
    // @ts-ignore
    let timer
    return function () {
        // @ts-ignore
        if (timer) clearTimeout(timer)
        timer = setTimeout(function () {
            fn()
        }, t)
    }
}

// 全局loading相关代码
let loading: any = null; //定义loading变量
//创建loading
function startLoading() {
    loading = ElLoading.service({
        lock: true,
        text: '加载中......',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    // loading最少显示时间（为了防止当请求立马响应页面会闪一下的情况）
    return new Promise((resolve) => {
        setTimeout(() => {
            // @ts-ignore
            resolve();
        }, 200);
    });
}

//清除loading
async function endLoading() {
    await startLoading();
    loading.close();
}

//记录当前需要显示加载动画的请求数量
let needLoadingRequestCount = 0;
//使用防抖函数防止重复创建和清理loading的问题
const showFullScreenLoading = debounce(() => {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
}, 50);

const tryHideFullScreenLoading = debounce(() => {
    // if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
}, 50);

axios.interceptors.request.use(
    function (config) {
        console.log("xinChat-token", localStorage.getItem("xinChat-token"));
        //校验token是否过期
        if (localStorage.getItem("xinChat-token")) {
            config.headers["xinChat-token"] = localStorage.getItem("xinChat-token");
        }
        // 在发送请求之前做些什么
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        const {responseType} = response.config;
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        const responseData = response.data;
        //未登录
        if (UNAUTHORIZED_CODES.has(response.data.code)) {
            // 使用 Set 来判断状态码，优化了原有的冗长的条件判断
            if (!response.request.responseURL.includes(LOGIN_REQUEST_URL) && !window.location.pathname.includes(LOGIN_PAGE_PATH)) {
                window.location.href = `/user/login?redirect=${window.location.href}`;
            }
        }
        //如果返回的是流
        if (responseType === "blob" || responseType === "arraybuffer") {
            return responseData;
        }
        return response;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        return Promise.reject(error.message);
    }
);
