import {createApp} from 'vue'
import {createPinia} from 'pinia'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// @ts-ignore
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import "@/assets/cust-elementplus.scss"
import "@/assets/icon/iconfont.css"
import "@/assets/base.scss"
import "@/config/axios";
import "@/access/index";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Verify from "@/utils/Verify";
import Confirm from "@/utils/Confirm";
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import mitt from "mitt";
const eventBus = mitt()
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(createPinia()).use(router).use(ElementPlus, {
    locale: zhCn,
}).use(ContextMenu)

//自定义全局组件
app.config.globalProperties.Verify = Verify
app.config.globalProperties.Confirm = Confirm
app.mount('#app')

export default eventBus
