import { createStore } from 'vuex'
import cart from './modules/carts'
import user from './modules/user'
import category from './modules/category'
// 导入数据持久化插件
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
  state: {
  },
  getters: {
    categoryList: state => state.category.list // nav分类列表
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cart,
    user,
    category
  },
  // 配置插件
  plugins: [
    // 数据持久化插件
    createPersistedstate({ // 默认存储在localStorage里
      key: 'eB2C-pc-store', // 本地存储名字
      paths: ['user', 'cart'] // 对这两个模块进行持久化
    })
  ]
})
