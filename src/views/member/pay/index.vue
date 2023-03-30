<template>
    <!-- 支付页面 -->
    <div class="b2c-pay-page">
      <div class="container">
        <B2cBread>
          <B2cBreadItem to="/">首页</B2cBreadItem>
          <B2cBreadItem to="/cart">购物车</B2cBreadItem>
          <B2cBreadItem>支付订单</B2cBreadItem>
        </B2cBread>
        <!-- 付款信息 -->
        <div class="pay-info" v-if="order">
          <span class="icon iconfont icon-queren2"></span>
          <div class="tip">
            <p>订单提交成功！请尽快完成支付。</p>
          <p v-if="order.countdown > -1">支付还剩 <span>{{timeText}}</span>, 超时后将取消订单</p>
          <p v-else>订单已经超时</p>
          </div>
          <div class="amount">
            <span>应付总额：</span>
            <span>¥{{order.payMoney}}</span>
          </div>
        </div>
        <!-- 付款方式 -->
        <div class="pay-type">
          <p class="head">选择以下支付方式付款</p>
          <div class="item">
            <p>支付平台</p>
            <a class="btn wx" href="javascript:;" :class="{active:payChannel===1}" @click="payChannel=1"></a>
            <a class="btn alipay" @click="openPayLoad"  :href="payUrl" target="_blank" :class="{active:payChannel===2}" ></a>
          </div>
          <div class="item">
            <p>支付方式</p>
            <a class="btn" href="javascript:;">招商银行</a>
            <a class="btn" href="javascript:;">工商银行</a>
            <a class="btn" href="javascript:;">建设银行</a>
            <a class="btn" href="javascript:;">农业银行</a>
            <a class="btn" href="javascript:;">交通银行</a>
          </div>
        </div>
      </div>
      <!-- 支付提示对话框 -->
      <B2cDialog title="正在支付..." v-model:visible="visible">
      <div class="pay-wait">
        <img src="@/assets/images/load1.gif" alt="">
        <div v-if="order">
            <p>如果支付成功：</p>
            <RouterLink :to="`/member/order/${$route.query.id}`">查看订单详情></RouterLink>
            <p>如果支付失败：</p>
            <RouterLink to="/">查看相关疑问</RouterLink>
        </div>
      </div>
    </B2cDialog>
    </div>
  </template>
<script>
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import { usePayTime } from '@/hooks'
import { baseURL } from '@/utils/request'

export default {
  name: 'B2cPayPage',
  setup () {
    const route = useRoute()
    const order = ref(null) // 订单
    const payChannel = ref(2) // 支付渠道，1支付宝、2微信
    // 查询订单详情
    findOrder(route.query.id).then(data => {
      // 设置订单
      order.value = data.result
      // 拿到数据 倒计时开始
      // 后端提供 countdown 倒计时秒数
      if (data.result.countdown > -1) {
        start(data.result.countdown)
      }
    })
    const { start, timeText } = usePayTime()
    // 支付地址
    // const payUrl = '后台服务基准地址+支付页面地址+订单ID+回跳地址'
    const redirect = encodeURIComponent('http://www.corho.com:8080/#/pay/callback')// 回跳地址
    const payUrl = `${baseURL}pay/aliPay?orderId=${route.query.id}&redirect=${redirect}`

    // 支付提示加载
    const openPayLoad = () => {
      visible.value = true
      order.value.payChannel = 2
    }
    const visible = ref(false)
    return { order, start, timeText, payChannel, payUrl, visible, openPayLoad }
  }
}
</script>
  <style scoped lang="less">
  .pay-info {
    background: #fff;
    display: flex;
    align-items: center;
    height: 240px;
    padding: 0 80px;
    .icon {
      font-size: 80px;
      color: #1dc779;
    }
    .tip {
      padding-left: 10px;
      flex: 1;
      p {
        &:first-child {
          font-size: 20px;
          margin-bottom: 5px;
        }
        &:last-child {
          color: #999;
          font-size: 16px;
        }
      }
    }
    .amount {
      span {
        &:first-child {
          font-size: 16px;
          color: #999;
        }
        &:last-child {
          color: @priceColor;
          font-size: 20px;
        }
      }
    }
  }
  .pay-type {
    margin-top: 20px;
    background-color: #fff;
    padding-bottom: 70px;
    p {
      line-height: 70px;
      height: 70px;
      padding-left: 30px;
      font-size: 16px;
      &.head {
        border-bottom: 1px solid #f5f5f5;
      }
    }
    .btn {
      width: 150px;
      height: 50px;
      border: 1px solid #e4e4e4;
      text-align: center;
      line-height: 48px;
      margin-left: 30px;
      color: #666666;
      display: inline-block;
      &.active,
      &:hover {
        border-color: @b2cColor;
      }
      &.alipay {
        background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
      }
      &.wx {
        background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat center / contain;
      }
    }
  }
  .pay-wait {
  display: flex;
  justify-content: space-around;

  p {
    margin-top: 30px;
    font-size: 14px;
  }
  a {
    color: @b2cColor;
  }
}
  </style>
