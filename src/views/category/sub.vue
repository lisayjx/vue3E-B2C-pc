<template>
  <!-- sub二级导航页面二级类名 -->
  <div class="subCategory">
    <div class="container">
      <!--二级类目 面包屑 -->
      <sub-bread></sub-bread>
      <!-- 筛选区块 -->
      <sub-filter></sub-filter>
      <!-- 商品面板（排序+列表） -->
      <div class="goods-list">
        <!-- 排序组件 -->
        <sub-sort></sub-sort>
        <!-- 列表 -->
        <ul>
          <li v-for="i in 20" :key="i">
            <!-- 商品item组件 -->
            <goods-item :good="{}"></goods-item>
          </li>
        </ul>
            <!-- 无限加载组件 -->
      <b2c-infinite-loading @infinite="getData" :loading="loading" :finished="finished"></b2c-infinite-loading>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import subBread from './components/sub-bread.vue'
import subFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
export default {
  name: 'subCategory',
  components: { subBread, subFilter, SubSort, GoodsItem },
  setup () {
    const finished = ref(false)
    const loading = ref(false)
    // 获取数据
    const getData = () => {
      // 请求接口
    }

    return { finished, loading, getData }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
