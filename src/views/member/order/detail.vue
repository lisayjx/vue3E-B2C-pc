<template>
  <!-- 点击订单列表里的订单的 查看详情 跳转过来的页 -->
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 -->
    <DetailStep :order="order"/>
    <!-- 物流栏 -->
    <!-- setup必须在组件实例化时候执行，async意味着会稍后执行 所以组件创建失败
      所以必须得等setup执行完之后 再去实例化组件,suspense起这个作用-->
    <Suspense>
      <!-- 异步组件 -->
      <template #default>
        <DetailLogistics v-if="[3,4,5].includes(order.orderState)" :order="order"/>
      </template>
      <!-- 异步组件请求数据时候 展示得loading -->
      <template  #fallback>
        <div class="loading"></div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <DetailInfo :order="order"/>
  </div>
</template>
<script>
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailAction from './components/detail-action'
import DetailStep from './components/detail-step.vue'
import DetailLogistics from './components/detail-logistics.vue'
import DetailInfo from './components/detail-info'
export default {
  name: 'OrderDetailPage',
  components: { DetailAction, DetailStep, DetailLogistics, DetailInfo },
  setup () {
    const order = ref(null)// 订单
    const route = useRoute()
    // 获取订单详情
    findOrder(route.params.id).then(data => { // 点击查看详情时候跳转带的id
      order.value = data.result
    })
    return { order }
  }
}
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
  min-height: 400px;
}
.loading {
  height: 200px;
  width: 200px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/load1.gif)
    no-repeat center;
}
</style>
