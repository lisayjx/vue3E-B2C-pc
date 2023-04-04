<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a @click="toggle(-1)" href="javascript:;" :class="{disabled:currIndex===0}" class="iconfont icon-angle-left prev"></a>
      <a @click="toggle(1)" href="javascript:;" :class="{disabled:currIndex===1}" class="iconfont icon-angle-right next"></a>
    </template>
  <div ref="target" class="box">
    <transition name="fade" >
      <ul class="list" :style="{transform:`translateX(${-currIndex*1240}px)`}"  v-if="brands.length" >
        <li v-for="item in brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" >
          </RouterLink>
        </li>
      </ul>
     <!-- 骨架屏 -->
    <div class="skeleton" v-else>
      <b2c-skeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px"/>
    </div>
   </transition>
  </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel'
import { getBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    // 得到品牌数据brands
    let brands = ref([])
    // getBrand(10).then(res => {
    //   brands.value = res.result
    //   console.log(brands.value)
    // })
    // 数据懒加载
    const target = ref(null)
    brands = useLazyData(target, () => getBrand(10))// 注意：useLazyData需要的是API函数,那就传函数，如果遇到要传参的情况，自己写函数再函数中调用API
    // 切换页
    const currIndex = ref(0)
    const toggle = (step) => {
      const newIndex = currIndex.value + step
      if (newIndex < 0 || newIndex > 1) return
      currIndex.value = newIndex
    }
    // 左右滑动 是用切换ul的x轴位置 来做，0*1240，-1*1240左滑
    // :style="{transform:`translateX(${-currIndex*1240}px)`}"
    return { brands, target, currIndex, toggle }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @b2cColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
.skeleton {
    width: 100%;
    display: flex;
    .item {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
</style>
