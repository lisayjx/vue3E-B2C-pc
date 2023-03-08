<template>
  <div class="home-banner">
    <!-- 轮播图组件 -->
    <b2c-carousel :sliders="sliders" :autoPlay="true"></b2c-carousel>
  </div>
</template>
<script>
import { ref } from 'vue'
import { getBanner } from '@/api/home'
export default {
  name: 'HomeBanner',
  setup () {
    // 获取轮播图数据
    const sliders = ref([])
    getBanner().then(res => {
      sliders.value = res.result
    })
    return { sliders }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
// 覆盖轮播图组件样式
.b2c-carousel {
  ::v-deep .carousel-btn.prev {
    left: 270px!important;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>
