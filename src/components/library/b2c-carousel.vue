<template>
    <div class='b2c-carousel' @mouseenter="stop" @mouseleave="start">
        <!-- 图片容器 -->
        <ul class="carousel-body" >
            <!-- 让图片显示加fade -->
            <li class="carousel-item " v-for="(item,i) in sliders" :key="i" :class="{fade:i===currIndex}">
                <RouterLink :to="item.hrefUrl">
                    <img  :src="item.imgUrl" alt="">
                </RouterLink>
            </li>
        </ul>
        <!-- 上一张 -->
        <a href="javascript:;" class="carousel-btn prev" @click="toggle(-1)"><i class="iconfont icon-angle-left"></i></a>
        <!-- 下一张 -->
        <a href="javascript:;" class="carousel-btn next" @click="toggle(1)"><i class="iconfont icon-angle-right"></i></a>
       <!-- 指示器 -->
        <div class="carousel-indicator">
            <!-- active激活点 -->
            <span @click="currIndex=i" v-for="(item,i) in sliders" :key="i" :class="{active:i===currIndex}"></span>
        </div>
    </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'
export default {
  name: 'B2cCarousel',
  props: {
    sliders: { // 轮播图数据
      type: Array,
      default: () => [] // 复杂数据类型默认值为函数
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 持续时间
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    const currIndex = ref(0) // 当前索引 默认值0

    // 1.自动轮播
    let timer = null
    const autoPlayFn = () => {
      // 隔3s自动播放
      timer = setInterval(() => {
        currIndex.value++
        if (currIndex.value >= props.sliders.length) {
          currIndex.value = 0
        }
      }, props.duration)
    }
    // 什么时候调用自动播放逻辑 props.sliders有变化时
    // 有sliders数据&&开启自动播放，才调用自动播放函数
    watch(() => props.sliders, (newVal) => {
      if (newVal.length && props.autoPlay) {
        autoPlayFn()
      }
    }, { immediate: true })// 考虑到可能sliders可能是静态数据写死的

    // 2.如果有自动轮播，鼠标进入暂停，离开继续
    const stop = () => {
      if (timer) clearInterval(timer)
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }
    // 3.点击指示器点，切换 直接写在了模板里
    // 4.点击切换 上一张，下一张
    const toggle = (step) => {
      const newIndex = currIndex.value + step
      if (newIndex < 0) {
        currIndex.value = props.sliders.length - 1
        return
      }
      if (newIndex > props.sliders.length - 1) {
        currIndex.value = 0
        return
      }
      currIndex.value = newIndex
    }
    // 组件消耗，清理定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { currIndex, autoPlayFn, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.b2c-carousel {
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 150px;
    position: relative;

    .carousel {
        &-body {
            width: 100%;
            height: 100%;
        }

        &-item {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;//透明
            transition: opacity 0.5s linear;

            &.fade {
                opacity: 1;//显示
                z-index: 1;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }

        &-indicator {
            position: absolute;
            left: 0;
            bottom: 20px;
            z-index: 2;
            width: 100%;
            text-align: center;

            span {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                cursor: pointer;

                ~span {
                    margin-left: 12px;
                }

                &.active {
                    background: #fff;
                }
            }
        }

        &-btn {
            width: 44px;
            height: 44px;
            background: rgba(0, 0, 0, .2);
            color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 228px;
            z-index: 2;
            text-align: center;
            line-height: 44px;
            opacity: 0;
            transition: all 0.5s;

            &.prev {
                left: 20px;
            }

            &.next {
                right: 20px;
            }
        }
    }

    &:hover {
        .carousel-btn {
            opacity: 1;
        }
    }
}</style>
