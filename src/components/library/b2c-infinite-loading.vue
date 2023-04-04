<template>
    <div class="b2c-infinite-loading" ref="container">
      <div class="loading" v-if="loading">
        <span class="img"></span>
        <span class="text">正在加载...</span>
      </div>
      <div class="none" v-if="finished">
        <span class="img"></span>
        <span class="text">亲，没有更多了</span>
      </div>
    </div>
  </template>

<script>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
export default {
  name: 'B2cInfiniteLoading',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
  //  监听进入可视区
    const container = ref(null)// 获取dom元素
    // useIntersectionObserver('dom',()=>{回调},{配置})
    useIntersectionObserver(
      container,
      ([{ isIntersecting }], dom) => {
        if (isIntersecting) { // 如果进入可视区
        //  触发加载事件（条件:1.如果正在加载时候(发请求时候)不能触发加载事件，得等加载完毕才能触发2.数据没了数据加载完毕）
        // 触发加载事件条件:没请求数据并且数据没加载完（还有数据）得时候
          if (!props.loading && !props.finished) {
            emit('infinite') // 通知父组件 请求数据
          }
        }
      }, { threshold: 0 })

    return { container }
  }

}
</script>

  <style scoped lang='less'>
  .b2c-infinite-loading {
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      .img {
        width: 50px;
        height: 50px;
        background: url(../../assets/images/load.gif) no-repeat center / contain;
      }
      .text {
        color: #999;
        font-size: 16px;
      }
    }
    .none {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      .img {
        width: 200px;
        height: 134px;
        background: url(../../assets/images/none.png) no-repeat center / contain;
      }
      .text {
        color: #999;
        font-size: 16px;
      }
    }
  }
  </style>
