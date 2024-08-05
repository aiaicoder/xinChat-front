import axios from "axios";

// 添加请求拦截器
axios.interceptors.request.use(
    function (config) {
        console.log("xinChat-token", localStorage.getItem("xinChat-token"));
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
        //如果返回的是流
        if (responseType === "blob" || responseType === "arraybuffer"){
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
