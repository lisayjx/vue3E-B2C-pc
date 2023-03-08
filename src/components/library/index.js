// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
import B2cSkeleton from './b2c-skeleton'
import B2cCarousel from './b2c-carousel'
import B2cMore from './b2c-more'

export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component(B2cSkeleton.name, B2cSkeleton)// 骨架屏
    app.component(B2cCarousel.name, B2cCarousel)// 轮播图
    app.component(B2cMore.name, B2cMore)// 查看更多小组件
  }
}
