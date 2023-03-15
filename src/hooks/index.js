// 可以复用得工具函数

// 引入vueuse函数库（需要下载）
import { useIntersectionObserver } from '@vueuse/core' // 监听进入可视区
import { ref } from 'vue'
/**
 * 数据懒加载
 * @param {Element} target -Dom对象 （被监听的对象）
 * @param {Function} apiFn -API函数 （不同的api函数）
 */
// target 是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
// isIntersecting 是否进入可视区域，true是进入 false是移出
// observerElement 被观察的dom
export const useLazyData = (target, apiFn) => {
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target, // 参数一
    ([{ isIntersecting }], dom) => { // 参数二
      // 在此处可根据isIntersecting来判断，然后做业务
      if (isIntersecting) { // 如果进入了可视区，停止观察，因为不能一直触发
        stop()
        apiFn().then(res => { // 调用api函数获取数据
          result.value = res.result
        })
      }
    },
    // 参数三
    // 配置选项
    {
      threshold: 0 // 只要进入可视区(进入门槛)就触发
    }
  )
  return result
}
