import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'// 引入重置样式包
import '@/assets/styles/common.less'// 引入公用样式
import UI from './components/library'// 引入全局用的插件
// 插件的使用，在main.js使用app.use(插件)
createApp(App).use(store).use(router).use(UI).mount('#app')
