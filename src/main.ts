
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// @ts-ignore
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import "@/assets/cust-elementplus.scss"
import "@/assets/icon/iconfont.css"
import "@/assets/base.scss"

import Verify from "@/utils/Verify";
const app = createApp(App)
app.use(createPinia()).use(router).use(ElementPlus, {
    locale: zhCn,
})

//自定义全局组件
app.config.globalProperties.Verify = Verify
app.mount('#app')
