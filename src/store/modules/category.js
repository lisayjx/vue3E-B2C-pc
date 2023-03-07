import { findAllCategory } from '@/api/category'
import { topCategory } from '@/api/constants'
// 分类模块
export default {
  namespaced: true,
  state: () => {
    return {
    //  分类信息集合
      // 如果默认是[]数组，看不见默认的9个分类，等你数据加载完毕才会看到。
      // 所以：根据常量数据来生成一个默认的顶级分类数据，不会出现空白（没数据的情况）
      list: topCategory.map(item => ({ name: item })) // 初始化数据，用的常量，怕最开始若没获取到数据会白屏
    }
  },
  mutations: {
    // 设置分类列表
    setList (state, headCategory) {
      state.list = headCategory
    },
    // 修改当前一级分类下的open数据为true
    show (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = true
    },
    // 修改当前一级分类下的open数据为false
    hide (state, id) {
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = false
    }
  },
  actions: {
    // 请求接口
    async getCategoryList (context) {
      const { result } = await findAllCategory()
      // 给一级分类加上一个控制二级分类显示隐藏的数据open
      result.forEach((item) => {
        item.open = false
      })
      context.commit('setList', result)
    }
  }

}
