import axios from "axios";
// 定义常量来避免硬编码，方便后期维护
const UNAUTHORIZED_CODES = new Set([40100, 40101, 40102, 40103, 40104]);
const LOGIN_REQUEST_URL = "user/get/login";
const LOGIN_PAGE_PATH = "user/login";
const isTokenValid = () => {
    const token = localStorage.getItem('xinChat-token');
    const expiration = localStorage.getItem('xinChat-token-expiration');
    if (expiration && token) {
        return Date.now() < parseInt(expiration);
    }
    return false;
}
// 添加请求拦截器
axios.interceptors.request.use(
    function (config) {
        console.log("进入请求拦截器");
        console.log("xinChat-token", localStorage.getItem("xinChat-token"));
        //校验token是否过期
        if (localStorage.getItem("xinChat-token")) {
            config.headers["xinChat-token"] = localStorage.getItem("xinChat-token");
        }
        // 在发送请求之前做些什么
        return config;
    },
    function (error) {
        // 对请求错误做些什么
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
