<template>
  <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
    <!-- 下面内容 -->
    <ul   class="goods-list">
      <li v-for="item in goods" :key="item.id">
        <RouterLink :to='`/product/${item.id}`'  >
          <img :src="item.picture" alt="">
          <p class="name">{{item.title}}</p>
          <p class="desc">{{item.alt}}</p>
        </RouterLink>
      </li>
    </ul>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { getHot } from '@/api/home'
import HomePanel from './home-panel.vue'
export default {
  name: 'HomeHot',
  components: { HomePanel },
  setup () {
    const goods = ref([])
    getHot().then(res => {
      goods.value = res.result
    })
    return { goods }
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
}
</style>
