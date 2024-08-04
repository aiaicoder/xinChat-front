
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
const app = createApp(App)
app.use(createPinia()).use(router).use(ElementPlus, {
    locale: zhCn,
})
app.mount('#app')
