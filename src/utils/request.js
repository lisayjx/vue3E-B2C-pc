// 封装请求工具
// 1. 创建一个新的axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
// 4. 导出一个函数，调用当前的axsio实例发请求，返回值promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 写在外面并且导出去是因为，有些请求不是用axios发的
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  // axios的一些配置
  baseURL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 拦截业务逻辑
  // 如果本地有token就在头部携带
  const { profile } = store.state.user
  if (profile.token) { // 如果有token
    // 设置token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(res => res.data, err => {
  // 401 状态码，进入该函数
  if (err.response && err.response.status === 401) {
    // 当前路由地址
    // 组件里头： $route.path === /user , $route.fullPath === /user?a=10
    // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据对象,所以需要加value
    // 1. 清空无效用户信息
    // 2. 跳转到登录页
    // 3. 跳转需要传参（当前路由地址）给登录页码(比如你没登陆你要下订单付款这时跳转到登陆然后登陆后在返回你刚才的页面)
    store.commit('user/setUser', {})
    // 地址合并过来可能会有特殊字符，所以怕解析时候出问题，需要转码
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 导出请求工具函数
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // submitData有两种情况，如果是get方法那就是params，如果不是get就是data
    // 【】可以动态设置key，【】里可以写js表达式或者变量
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
