<template>
<div class="detail-step">
    <!-- 订单状态是待付款：提交订单
    订单状态是待发货：付款成功
    订单状态是待收货：商品发货
    订单状态是待评价：确认收货
    订单状态是完成：订单完成
    订单状态是取消订单：提交订单 -->
    <!-- b2c-steps里别乱写注释 因为用jsx了 -->
    <B2cSteps :active="order.orderState===6?1:order.orderState">
      <B2cStepsItem title="提交订单" :desc="order.createTime" />
      <B2cStepsItem title="付款成功" :desc="order.payTime" />
      <B2cStepsItem title="商品发货" :desc="order.consignTime" />
      <B2cStepsItem title="确认收货" :desc="order.evaluationTime" />
      <B2cStepsItem title="订单完成" :desc="order.endTime" />
    </B2cSteps>
</div>
</template>

<script>
export default {
  name: 'DetailStep',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>

</style>
