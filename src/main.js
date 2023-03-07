import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'// 引入重置样式包
import '@/assets/styles/common.less'// 引入公用样式

createApp(App).use(store).use(router).mount('#app')
