<template>
  <!-- sub二级导航页面二级类名 -->
  <div class="subCategory">
    <div class="container">
      <!--二级类目 面包屑 -->
      <sub-bread></sub-bread>
      <!-- 筛选区块 -->
      <sub-filter @filterChange="handleFilterChange"></sub-filter>
      <!-- 商品面板（排序+列表） -->
      <div class="goods-list">
        <!-- 排序组件 -->
        <sub-sort @sort-change="handleSortChange"></sub-sort>
        <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <!-- 商品item组件 -->
            <goods-item :good="item"></goods-item>
          </li>
        </ul>
            <!-- 无限加载组件 -->
      <b2c-infinite-loading @infinite="getData" :loading="loading" :finished="finished"></b2c-infinite-loading>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import subBread from './components/sub-bread.vue'
import subFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { getSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name: 'subCategory',
  components: { subBread, subFilter, SubSort, GoodsItem },
  setup () {
    const finished = ref(false)// 加载中
    const loading = ref(false)// 数据是否加载完毕
    const goodsList = ref([])// 商品列表数据
    const route = useRoute()
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 获取数据
    const getData = () => {
      loading.value = true// 加载中
      // 请求接口
      // 设置二级分类id
      reqParams.categoryId = route.params.id
      getSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) { // 有数据
          goodsList.value.push(...result.items)// 追加数据
          reqParams.page++
        } else { // 如果没有数据
          finished.value = true// 数据加载完成
        }
        loading.value = false // 加载完毕
      })
    }
    // 在更改了二级分类是需要重新加载数据
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        finished.value = false
        goodsList.value = []// 列表空，加载更多组件顶上来，进入可视区，自动请求数据
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })
    // 1.更改排序组件的筛选数据，重新请求
    const handleSortChange = (sortParams) => {
      // console.log(sortParams)
      // {
      // inventory: true, // 是否有库存
      // onlyDiscount: false, // 只显示特惠
      // sortField: 'orderNum', // 排序字段
      // sortMethod: 'desc' // 排序规则 asc,desc
      // }
      finished.value = false
      // 和并请求参数，保留之前的参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []// 列表空，加载更多组件顶上来，进入可视区，自动请求数据
    }
    // 2.更改筛选组件的筛选数据，重新请求
    const handleFilterChange = (filterParams) => {
      // console.log(filterParams)// 筛选子组件传来得数据 {brandId，attrs:[{},{}]}
      finished.value = false
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []// 列表空，加载更多组件顶上来，进入可视区，自动请求数据
    }

    return { finished, loading, getData, goodsList, handleSortChange, handleFilterChange }
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
