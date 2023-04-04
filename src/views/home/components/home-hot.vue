<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <!-- 下面内容默认插槽 -->
    <div style="position: relative;height: 426px;" ref="target">
      <transition name="fade">
        <!-- 下面内容 -->
        <ul v-if="goods.length" class="goods-list">
          <li v-for="item in goods" :key="item.id">
            <RouterLink :to='`/product/${item.id}`'>
              <!-- <img :src="item.picture"  alt=""> -->
              <img v-lazyLoad="item.picture" alt="">
              <p class="name">{{ item.title }}</p>
              <p class="desc">{{ item.alt }}</p>
            </RouterLink>
          </li>
        </ul>
        <!-- 骨架屏 -->
        <home-skeleton v-else></home-skeleton>
      </transition>
    </div>
  </HomePanel>
  <input type="text" ref="input">
</template>

<script>
import { ref } from 'vue'
import { getHot } from '@/api/home'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeHot',
  components: { HomePanel, HomeSkeleton },
  setup () {
    let goods = ref([])
    // getHot().then(res => {
    //   goods.value = res.result
    // })
    // 使用数据懒加载

    const target = ref(null)// 得到target这个dom对象
    goods = useLazyData(target, getHot)// 被监听的dom对象，需要请求的api函数
    return { goods, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;

  li {
    width: 306px;
    height: 406px;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }

    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}</style>
