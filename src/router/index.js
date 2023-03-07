import { createRouter, createWebHashHistory } from 'vue-router'

// 懒加载引入路由
import Layout from '@/views/Layout'
import Home from '@/views/home'
import TopCategory from '@/views/category'
import SubCategory from '@/views/category/sub'

// 路由规则
const routes = [
  { // 一级路由布局容器
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home// 首页
      },
      {
        path: '/category/:id',
        component: TopCategory // 一级分类页面（点击一级导航进入的页面）
      },
      {
        path: '/category/sub/:id',
        component: SubCategory // 二级分类页面（点击二级导航进入的页面）
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
