<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <!-- 右侧 左右换页 -->
    <template #right>
        <!-- <b2c-more></b2c-more>   -->
    </template>
    <!-- 下面内容 -->
    <!-- <ul ref="pannel" class="goods-list">
      <li v-for="item in goods" :key="item.id">
        <RouterLink to="/">
          <img :src="item.picture" alt="">
          <p class="name">{{item.title}}</p>
          <p class="desc">{{item.alt}}</p>
        </RouterLink>
      </li>
    </ul> -->
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { getBrand } from '@/api/home' // 这个接口还没写
import HomePanel from './home-panel.vue'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup () {
    const goods = ref([])
    getBrand().then(res => {
      goods.value = res.result
    })
    return { goods }
  }
}

</script>

<style>

</style>
