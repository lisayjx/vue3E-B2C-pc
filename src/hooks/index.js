// 可以复用得工具函数

// 引入vueuse函数库（需要下载）
// 提供复用逻辑的函数（钩子）
// 监听进入可视区，定时器
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
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

/**
 * 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()// 结束
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()// 结束
  })

  // 开启定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')// 拿到时间就做数据转换
    resume()// 拿到数据后开始
  }

  return {
    start,
    timeText
  }
}

// day.js可以轻松转换秒级和毫秒级时间戳：
// dayjs().unix(); //秒
// dayjs().valueOf(); //毫秒
// 这里我们拿到后端传给我们的 毫秒，需要转成秒，所以用到unix
