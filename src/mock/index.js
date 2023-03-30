import Mock from 'mockjs'
import qs from 'qs'// node提供的，webpack又运行在node上 所以不用下载

// mock的配置
Mock.setup({
  // 随机延时500-1000毫秒，模拟网络延时
  timeout: '500-1000'
})

// 模拟拦截 /mock/test接口
// 3个参数
// 1.接口地址路径规则，需要匹配到他
// 2.请求方式
// 3.返回数据（函数返回数据）
// Mock.mock('/mock/test',)不对 因为之前还有基准地址，所以要写正则
// Mock.mock(/\/mock\/test/, 'get', () => {
//   // 可以写模拟随机数据的逻辑
// //   例如：模拟5条数据 每一个对象里面有id和名字
//   const arr = []
//   for (let i = 0; i < 5; i++) {
//     // arr.push(Mock.mock('@id'))
//     arr.push(Mock.mock({
//       id: '@id',
//       name: '@name'// @cname中文名
//     }))
//   }
//   return {
//     msg: '请求测试接口成功',
//     result: arr
//   }
// })

// 模拟 我的收藏 后端接口
Mock.mock(/\/member\/collect/, 'get', (config) => {
  // config前端传来的参数,里面有
//   body：params post请求时候前端传的参数
//   type：请求方式
//   url：请求地址上面带参数，解析出前端传来的参数 需要用到node提供的一个包 qs
  const queryStr = config.url.split('?')[1] // 以？分割 取出第二项目 也就是 ？后的参数，类似name=lisa&age=18&height=180
  const queryObj = qs.parse(queryStr) // 转换成对象,{ name: 'lisa', age: '18', height: '180' }

  const items = []
  for (let i = 0; i < queryObj.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)', // 10-20之间的中文
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)', // ( min, max, dmin, dmax ) 最小大几位
      // http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_7.jpg 有8张图片 只是数不同
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return { // 这些数据给前端返回去
    counts: 35,
    pageSize: +queryObj.pageSize, // 前端传来的
    page: +queryObj.pageSize, // 前端传来的
    items
  }
})
