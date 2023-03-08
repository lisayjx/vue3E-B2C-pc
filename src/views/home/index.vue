<template>
  <!-- 首页入口 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <home-category></home-category>
      <!-- 轮播图 -->
      <home-banner></home-banner>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <div class="home-new">
    <home-new></home-new>
  </div>
  <!-- 人气推荐 -->
  <div class="home-hot">
    <home-hot></home-hot>
  </div>
  <!-- 热门品牌 -->
  <div class="home-brand">
    <home-brand></home-brand>
  </div>

</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'

export default {
  name: 'home-page',
  components: { HomeCategory, HomeBanner, HomeNew, HomeHot, HomeBrand },
  setup () {

  }
}
</script>

<style scoped lang="less">

</style>
