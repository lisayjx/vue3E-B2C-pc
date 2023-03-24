import { getNewCartGoods } from '@/api/cart'
// 购物车模块
// 总结：
// 购物车的各种操作都会有两种状态的区分，但是不会在组件中去区分。
// 而是在封装在vuex中的actions中去区分，在组件上只需调用actions即可。
// 在actions中通过user信息去区分登录状态
//     未登录，通过mutations修改vuex中的数据即可，vuex已经实现持久化，会同步保持在本地。
//     已登录，通过api接口去服务端操作，响应成功后通过mutations修改vuex中的数据即可，它也会同步在本地。
// 不管何种操作何种状态返回一个promise，然后组件能够判断操作是否完毕是否成功，再而去做其他事情。
// 注意：

// 登录后，需要合并本地购物车到服务端。
// 退出后，清空vuex数据也会同步清空本地数据。
export default {
  namespaced: true,
  state () {
    return {
      // 购物车列表
      list: []
    }
  },
  mutations: {
    // 1.把数据加入购物车
    // 约定加入购物车字段必须和后端保持一致payload对象的字段
    // 它们是: id skuId name attrsText picture price nowPrice selected stock count isEffective
    // 插入数据规则:
    // 1．先找下是否有相同商品
    // 2．如果有相同的商品，查询它的数量，累加到payload上，再保存最新位置，愿来商品需要删除
    // 3. 如果没有相同商品，直接放到最上面
    insertCart (state, payload) {
      // sameIndex：如果能找到list里和新加入的对象里skuId一样的，那就是找到了相同的商品的索引
      const sameIndex = state.list.findIndex(good => good.skuId === payload.skuId)
      if (sameIndex > -1) { // 如果有相同的商品
        // 把数量累加在新的上
        payload.count += state.list[sameIndex].count
        // 删除原来的
        state.list.splice(sameIndex, 1)
        // 追加新的在最上面
        state.list.unshift(payload)
      } else { // 如果没有相同的
        // 追加新的在最上面
        state.list.unshift(payload)
      }
    },
    // 更新修改购物车商品
    updateCart (state, goods) {
    // 此时goods:nowPrice stock isEffective，下一次就不一定
    // goods商品对象的字段不固定，想让goods里传哪些字段就改哪些字段
    // 字段合法 才可以改,如果字段值有=''或者null 改不了
    // goods商品对象必须有的字段是 skuId
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)// updateGoods找到了需要更新那项
      for (const key in goods) { // 遍历goods中的你要修改的字段
        // 写一堆为什么不直接写 if(goods[key] )呢?因为有的字段是传布尔值false呢
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]// goods里传哪些字段就改哪些字段
        }
      }
    }
  },
  actions: {
    // 获取另外模块user模块的state数据 context.rootState
    // 1.加入购物车（未登录（同步），已登录（异步）所以他俩需要promise）
    insertCart (context, payload) {
      return new Promise((resolve, reject) => {
        // 已登录
        if (context.rootState.user.profile.token) {
          console.log('已登录做购物车')
        } else {
          // 未登录（本地）
          context.commit('insertCart', payload)
          resolve()// 因为将来需要用then拿到结果
        }
      })
    },
    // 2.获取商品列表(未登录，已登录)
    // 未登录:本地的才要挨个商品更新商品信息
    // 已登录:请求后台接口拿到商品列表
    getNewCart (context, goods) {
      return new Promise((resolve, reject) => {
        // 已登录
        if (context.rootState.user.profile.token) {
          // console.log('已登录做购物车')
        } else {
          // 未登录（本地）
          // 有几个商品发几个请求,同时发送请求,一次性得到结果Promise.all(promise数组).then(dataList=>{})
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          const promiseArr = context.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            console.log(dataList, '111')
            // 遍历得到的所有商品更新本地购物车
            dataList.forEach((data, index) => {
              // console.log(data)//data.result里没有skuId，我们自己加上，因为他必须传
              // dataList成功结果的集合，数据顺序和promiseArr顺序一致，它又是根据state.list而来
              // 咱们传什么属性，上边的updateCart他就修改什么属性
              context.commit('updateCart', { skuId: context.state.list[index].skuId, ...data.result })
            })
            // 调用resolve代表操作成功
            resolve()
          })
        }
      })
    }
  },
  getters: {
  // 其他页的购物车从vuex中获取购物车数据，需要获取到有效额数据（不能过期，list里的是有效和无效的 所以需要getters取出有效的）
    // 有效商品列表
    validList (state) {
      // 有效：库存>0，isEffective为true
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal (state, getters) {
      // 用到了validList
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // 为了保证价格的精度，所以*100，因为一般钱数都是.00两位
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    }
  }
}
