import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
// 懒加载引入路由
import Layout from '@/views/Layout'
import Home from '@/views/home'
import { h } from 'vue' // 创建标签
const TopCategory = () => import('@/views/category')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback')
const Cart = () => import('@/views/cart')
const Register = () => import('@/views/login/register')
const PayCheckout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index')
const PayResult = () => import('@/views/member/pay/result')

const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order/index.vue')
const MemberOrderDetail = () => import('@/views/member/order/detail.vue')

// 路由规则
// /member开头的都是需要登陆的
const routes = [
  { // 一级路由布局容器
    path: '/',
    component: Layout, // 上面导航条和下面footer布局
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
      },
      {
        path: '/cart', // 购物车页
        component: Cart
      },
      {
        path: '/member/checkout', // 需要登陆后才能跳转到的结算页面
        component: PayCheckout
      },
      { path: '/member/pay', component: PayIndex }, // 支付
      { path: '/pay/callback', component: PayResult }, // 支付结果,后端返回的地址就是/pay/callback
      // 个人中心布局页(他需要 上面导航条布局)
      {
        path: '/member',
        component: MemberLayout, // （左侧菜单布局）
        children: [
          { path: '/member', component: MemberHome }, // 个人中心页
          // { path: '/member/order', component: MemberOrder }, // 个人中心-我的订单
          // { path: '/member/order/:id', component: MemberOrderDetail }// 个人中心-我的订单-详情页
          {
            // vue3.0 需要有嵌套关系才能模糊匹配
            path: '/member/order', // 改造我的订单的路由
            component: { render: () => h(<RouterView/>) }, // 创建RouterView标签
            children: [
              { path: '', component: MemberOrder }, // 我的订单页 /member/order
              { path: ':id', component: MemberOrderDetail }// 我的订单详情页 /member/order/:id
            ]
          }
        ]
      }
    ]
  },
  // 登录页
  {
    path: '/login', component: Login
  },
  // qq登陆后回跳的页
  {
    path: '/login/callback', component: LoginCallback
  },
  // 注册页
  {
    path: '/register', component: Register
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

// 前置路由守卫
// js模块中：router.currentRoute.value.fullPath 就是当前路由地址
// '/user?a=10'  path: /user ,fullPath : user?a=10

// 1、to:即将要进入的目标路由对象；
// 2、from:当前导航即将要离开的路由对象；
// 3、next ：调用该方法后，才能进入下一个钩子函数（afterEach）。
router.beforeEach((to, from, next) => {
  // 约定： 需要登陆后才能跳转的地址 都是以/member开头的
  // 判断 如果用户没登录&&跳转的地址开头为/member
  // 就先跳转到登录页，然后重定向到你要去的地址
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  // 剩下放行
  next()
})

export default router
