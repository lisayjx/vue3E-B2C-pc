// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展
import B2cSkeleton from './b2c-skeleton'
import B2cCarousel from './b2c-carousel'
import B2cMore from './b2c-more'
import B2cBread from './b2c-bread'
import B2cBreadItem from './b2c-bread-item'
import defaultImg from '@/assets/images/false.png' // 引入默认图片

export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component(B2cSkeleton.name, B2cSkeleton)// 骨架屏
    app.component(B2cCarousel.name, B2cCarousel)// 轮播图
    app.component(B2cMore.name, B2cMore) // 查看更多小组件
    app.component(B2cBread.name, B2cBread) // 面包屑组件
    app.component(B2cBreadItem.name, B2cBreadItem) // 单项面包屑组件
    defineDirective(app)// 自定义指令
  }
}

// 自定义指令
const defineDirective = (app) => {
  // 1．图片懒加载指令v-lazyLoad
// 原理:先存储图片地址不能在src上，当图片进入可视区，将你存储图片地址设置给图片元素（dom）即可。
  app.directive('lazyLoad', {
    // vue2.0监听使用指令的DOM是否创建好，钩子函数: inserted
    // vue3,0 的指令拥有的钩子函数和组件的一样，使用指令的DON是否创建好，钩子函数: mounted,onMounted是在组合API时候使用，现在是选项
    mounted (el, binding) { // 绑定的元素，绑定的值
      // 2.创建一个观察对象，来观察当前使用指令得元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) { // 如果进入了可视区
          // 谁进入了可视区？得用observe去观察 是哪个元素使用了该指令，所以会传入dom对象el
          // 停止观察，因为观察一次就够了
          observe.unobserve(el)
          // console.log(binding.value, el) // binding.value就是绑定的地址
          // 3.监听图片加载失败，用默认图
          el.onerror = () => {
            el.src = defaultImg
          }
          // 4.将指令v-lazyLoad上的地址设置给el的src属性
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      observe.observe(el)// 使用observe上得observe方法观察这个dom元素
    }
  })
}
