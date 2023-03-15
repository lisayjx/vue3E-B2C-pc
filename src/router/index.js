import { createRouter, createWebHashHistory } from 'vue-router'

// 懒加载引入路由
import Layout from '@/views/Layout'
import Home from '@/views/home'
const TopCategory = () => import('@/views/category')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')

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
      },
      {
        path: '/product/:id', // 商品详情页
        component: Goods
      }
    ]
  }
]
// vue2.0 new VueRouter()创建路由实例
// vue3.0 createRouter()创建路由实例

const router = createRouter({
  history: createWebHashHistory(), // 使用hash路由模式
  routes,
  scrollBehavior () { // 每次切换路由时，页面滚动的位置
    // return { x: 0, y: 0 }// vue2.0顶部
    return { left: 0, top: 0 }// vue3.0顶部
  }
})

export default router
