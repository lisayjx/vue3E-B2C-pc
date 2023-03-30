<template>
    <!-- 个人中心页 -->
    <div class="member-home">
      <!-- 概览 -->
      <HomeOverview />
      <!-- 收藏 -->
      <HomePanel title="我的收藏">
        <GoodsItem v-for="item in collectGoods" :key="item.id" :good="item" />
      </HomePanel>
      <!-- 足迹 -->
      <HomePanel title="我的足迹">
        <GoodsItem v-for="i in 4" :key="i" :good="good" />
      </HomePanel>
      <!-- 猜你 -->
      <GoodsRelevant />
    </div>
  </template>
<script>
import { ref } from 'vue'
import HomeOverview from './components/home-overview'
import HomePanel from './components/home-panel'
import GoodsRelevant from '@/views/goods/components/goods-relevant'
import GoodsItem from '@/views/category/components/goods-item'

import { getCollect } from '@/api/member'
export default {
  name: 'MemberHome',
  components: {
    HomeOverview,
    HomePanel,
    GoodsRelevant,
    GoodsItem
  },
  setup () {
    // 模拟调用 我的收藏接口
    const collectGoods = ref(null)
    getCollect({ page: 1, pageSize: 4 }).then(data => {
      collectGoods.value = data.items
      console.log(data)
    })
    return { collectGoods }
  }
}
</script>
  <style scoped lang="less">
  :deep(.b2c-carousel) .carousel-btn.prev {
    left: 5px;
  }
  :deep(.b2c-carousel) .carousel-btn.next {
    right: 5px;
  }
  </style>
