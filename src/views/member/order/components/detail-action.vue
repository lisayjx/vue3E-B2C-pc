<template>
    <div class="detail-action">
      <div class="state">
        <span class="iconfont icon-order-unpay"></span>
        <p>{{orderStatus[order.orderState].label}}</p>
      </div>
      <div class="info">
        <p>订单编号：{{order.id}}</p>
        <p>下单时间：{{order.createTime}}</p>
      </div>
      <div class="btn">
      <!-- 待付款 -->
      <template v-if="order.orderState === 1">
        <B2cButton @click="$router.push('/member/pay?id='+order.id)" type="primary" size="small">立即付款</B2cButton>
        <B2cButton type="gray" size="small" @click="cancelOrder(order)">取消订单</B2cButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <B2cButton @click="$router.push(`/member/checkout?orderId=${order.id}`)" type="primary" size="small">再次购买</B2cButton>
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">
        <B2cButton type="primary" size="small" @click="onConfirmOrder(order)">确认收货</B2cButton>
        <B2cButton type="plain" size="small">再次购买</B2cButton>
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <B2cButton @click="$router.push(`/member/checkout?orderId=${order.id}`)" type="primary" size="small">再次购买</B2cButton>
        <B2cButton type="plain" size="small">评价商品</B2cButton>
        <B2cButton type="gray" size="small">申请售后</B2cButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <B2cButton @click="$router.push(`/member/checkout?orderId=${order.id}`)" type="primary" size="small">再次购买</B2cButton>
        <B2cButton type="plain" size="small">查看评价</B2cButton>
        <B2cButton type="gray" size="small">申请售后</B2cButton>
      </template>
      <!-- 已取消 -->
    </div>
    </div>

    <!-- 取消订单 组件 -->
    <Teleport to="#model">
      <OrderCancel ref="cancelDom"/>
    </Teleport>
</template>
<script>
// 1待付款：立即付款，取消订单
// 2待发货：再次购买
// 3待收货：确认收货，再次购买
// 4待评价：评价商品，再次购买，申请售后
// 5已完成：查看评价，再次购买，申请售后
// 6已取消：
import { orderStatus } from '@/api/constants'
// 引入取消订单组件 和取消订单逻辑代码
import OrderCancel from './order-cancel.vue'
import { useCancel, handlerConfirmOrder } from '../index.vue'

export default {
  name: 'OrderDetailAction',
  components: { OrderCancel },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  setup () {
    return { orderStatus, ...useCancel(), ...handlerConfirmOrder() }
  }
}
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @b2cColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .b2c-button {
      margin-left: 20px;
    }
  }
}
</style>
