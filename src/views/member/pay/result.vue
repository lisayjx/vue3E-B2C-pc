<template>
  <div class="B2c-pay-page">
    <div class="container">
      <B2cBread>
        <B2cBreadItem to="/">首页</B2cBreadItem>
        <B2cBreadItem to="/cart">购物车</B2cBreadItem>
        <B2cBreadItem>支付结果</B2cBreadItem>
      </B2cBread>
      <!-- 支付结果 -->
      <div class="pay-result" v-if="order">
        <span v-if="$route.query.payResult" class="iconfont icon-queren2 green"></span>
        <span v-else class="iconfont icon-shanchu red" ></span>
        <p class="tit">订单支付{{ $route.query.payResult?'成功':'失败'}}</p>
        <p class="tip">我们将尽快为您发货，收货期间请保持手机畅通</p>
        <p>支付方式：<span>{{ order.payChannel }}支付</span></p>
        <p>支付金额：<span>¥{{order?.payMoney}}</span></p>
        <div class="btn">
          <B2cButton @click="$router.push('member/order')" type="primary" style="margin-right:20px">查看订单</B2cButton>
          <B2cButton @click="$router.push('/')" type="gray">进入首页</B2cButton>
        </div>
        <p class="alert">
          <span class="iconfont icon-tip"></span>
          温馨提示：小象商场不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，保护资产、谨慎操作。
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
export default {
  name: 'B2cPayResultPage',
  setup () {
    const route = useRoute()
    // 查询订单详情
    const order = ref(null)
    findOrder(route.query.orderId).then(data => { // 通过后端给返回来的网址上的orderId来获取数据
      // 设置订单
      order.value = data.result
      console.log(data.result)
    })
    return { order }
  }
}
</script>
<style scoped lang="less">
.pay-result {
  padding: 100px 0;
  background: #fff;
  text-align: center;
  > .iconfont {
    font-size: 100px;
  }
  .green {
    color: #1dc779;
  }
  .red {
    color: @priceColor;
  }
  .tit {
    font-size: 24px;
  }
  .tip {
    color: #999;
  }
  p {
    line-height: 40px;
    font-size: 16px;
  }
  .btn {
    margin-top: 50px;
  }
  .alert {
    font-size: 12px;
    color: #999;
    margin-top: 50px;
  }
}
</style>
