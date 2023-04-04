<template>
    <div class="goods-image">
        <!-- 弹出的大图 -->
        <div v-show="show" class="large" :style="[{backgroundImage:`url(${images[currIndex]})`},largePosition]"></div>
        <!-- 中图 -->
      <div class="middle"  ref="target" @mouseenter="show=true">
        <img :src="images[currIndex]">
        <!-- 遮罩层 -->
        <div v-show="show" class="mock" :style="mockPosition"></div>
      </div>
      <!-- 5个小图 -->
      <ul class="small">
        <li v-for="(img,i) in images" :key="img"   :class="{active:i===currIndex}">
          <img :src="img" @mouseenter="currIndex=i">
        </li>
      </ul>
    </div>
  </template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'// 使用vueuse提供的API获取鼠标偏移量
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    // 当前图片索引
    const currIndex = ref(0)

    // 1.是否显示遮罩层和大图
    const show = ref(false)
    // 2.遮罩层坐标(修改position样式)
    const mockPosition = reactive({
      left: 0,
      top: 0
    })
    // 3.大图的背景定位(修改position样式)
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 4.使用useMouseInElement得到基于元素左上角的坐标和是否离开元素
    const target = ref(null)// 鼠标移入的dom元素
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    // 监听这三个数据的变化
    watch([elementX, elementY, isOutside], () => {
      //   边界检测   控制X,Y轴方向的定位 0-200 之间
      mockPosition.left = elementX.value - 100
      mockPosition.top = elementY.value - 100
      if (mockPosition.left < 0) {
        mockPosition.left = 0
      } else if (mockPosition.left > 200) {
        mockPosition.left = 200
      }
      if (mockPosition.top < 0) {
        mockPosition.top = 0
      } else if (mockPosition.top > 200) {
        mockPosition.top = 200
      }
      const mpl = mockPosition.left
      const mpt = mockPosition.top
      //   遮罩层坐标
      mockPosition.left = mpl + 'px'
      mockPosition.top = mpt + 'px'
      // 设置是否显示预览大图
      show.value = !isOutside.value
      //   大图的定位
      largePosition.backgroundPositionX = -mpl * 2 + 'px'
      largePosition.backgroundPositionY = -mpt * 2 + 'px'
    })

    return { currIndex, show, mockPosition, largePosition, target }
  }
}

</script>
  <style scoped lang="less">
 .goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;  //加上这个鼠标变成拖拽形
    .mock{
        width: 200px;
     height: 200px;
     background: rgba(0,0,0,.2);
     left: 0;
     top: 0;
     position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @b2cColor;
      }
    }
  }
}
  </style>
