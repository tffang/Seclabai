import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 配置Element Plus主题
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 导入路由
import router from './router/index.js'

// 导入Pinia
import { createPinia } from 'pinia'

// 创建Pinia实例
const pinia = createPinia()

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default',
  zIndex: 3000
})
app.use(router)
app.use(pinia)

// 挂载应用
app.mount('#app')
