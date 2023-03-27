<template>
    <div class="b2c-pay-checkout-page">
      <div class="container">
        <B2cBread>
          <B2cBreadItem to="/">首页</B2cBreadItem>
          <B2cBreadItem to="/cart">购物车</B2cBreadItem>
          <B2cBreadItem >填写订单</B2cBreadItem>
        </B2cBread>
        <div class="wrapper" v-if="order">
          <!-- 收货地址 组件-->
               <CheckoutAddress @change="changeAddress" :userAddresses="order.userAddresses"/>
          <!-- 商品信息 -->
          <h3 class="box-title">商品信息</h3>
          <div class="box-body">
            <table class="goods">
              <thead>
                <tr>
                  <th width="520">商品信息</th>
                  <th width="170">单价</th>
                  <th width="170">数量</th>
                  <th width="170">小计</th>
                  <th width="170">实付</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.goods" :key="item.id">
                  <td>
                    <a href="javascript:;" class="info">
                      <img :src="item.picture" alt="">
                      <div class="right">
                        <p>{{ item.name}}</p>
                        <p>{{ item.attrsText}}</p>
                      </div>
                    </a>
                  </td>
                  <td>&yen;{{ item.price}}</td>
                  <td>{{ item.count}}</td>
                  <td>&yen;{{ item.totalPrice}}</td>
                  <td>&yen;{{ item.totalPayPrice}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 配送时间 -->
          <h3 class="box-title">配送时间</h3>
          <div class="box-body">
            <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
            <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
            <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
          </div>
          <!-- 支付方式 -->
           <h3 class="box-title">支付方式</h3>
          <div class="box-body">
            <a class="my-btn active" href="javascript:;">在线支付</a>
            <a class="my-btn" href="javascript:;">货到付款</a>
            <span style="color:#999">货到付款需付5元手续费</span>
          </div>
          <!-- 金额明细 -->
          <h3 class="box-title">金额明细</h3>
          <div class="box-body">
            <div class="total">
              <dl><dt>商品件数：</dt><dd>{{order.summary.goodsCount}}</dd></dl>
              <dl><dt>商品总价：</dt><dd>¥{{ order.summary.totalPrice}}</dd></dl>
              <dl><dt>运<i></i>费：</dt><dd>¥{{ order.summary.postFee}}</dd></dl>
              <dl><dt>应付总额：</dt><dd class="price">¥{{ order.summary.totalPayPrice}}</dd></dl>
            </div>
          </div>
          <!-- 提交订单 -->
          <div class="submit">
            <B2cButton type="primary">提交订单</B2cButton>
          </div>
        </div>
      </div>
    </div>
  </template>
<script>

import CheckoutAddress from './components/checkout-address.vue'
import { ref, reactive } from 'vue'
import { createOrder } from '@/api/order.js'
export default {
  name: 'B2cPayCheckoutPage',
  components: { CheckoutAddress },
  setup () {
    // 结算功能-生成订单-订单信息
    const order = ref(null)
    createOrder().then(res => {
      //   console.log(res.result) goods:[{},{}..] ,summary：{}，userAddresses：[]
      order.value = res.result
    })

    // 切换收货地址-----------
    // 1.组件初始化的时候需要得到一个默认的地址ID通知给结算组件
    // 2.对话框中渲染一个地址列表
    // 3.实现可以选中的效果，点击确认后变更显示地址，通知结算组件地址ID

    //    需要提交到后端的字段
    const reqParams = reactive({
      addressId: null
    })
    // 收到子组件在此页面初始化 时候 和修改选中时候传来的地址id
    const changeAddress = (addressId) => {
      reqParams.addressId = addressId
    }
    return { createOrder, order, changeAddress }
  }
}
</script>
  <style scoped lang="less">
  .b2c-pay-checkout-page {
    .wrapper {
      background: #fff;
      padding: 0 20px;
      .box-title {
        font-size: 16px;
        font-weight: normal;
        padding-left: 10px;
        line-height: 70px;
        border-bottom: 1px solid #f5f5f5;
      }
      .box-body {
        padding: 20px 0;
      }
    }
  }

  .goods {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    .info {
      display: flex;
      text-align: left;
      img {
        width: 70px;
        height: 70px;
        margin-right: 20px;
      }
      .right {
        line-height: 24px;
        p {
          &:last-child {
            color: #999;
          }
        }
      }
    }
    tr {
      th {
        background: #f5f5f5;
        font-weight: normal;
      }
      td,th {
        text-align: center;
        padding: 20px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          border-left: 1px solid #f5f5f5;
        }
        &:last-child {
          border-right: 1px solid #f5f5f5;
        }
      }
    }
  }
  .my-btn {
    width: 228px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-right: 25px;
    color: #666666;
    display: inline-block;
    &.active,&:hover {
      border-color: @b2cColor;
    }
  }
  .total {
    dl {
      display: flex;
      justify-content: flex-end;
      line-height: 50px;
      dt {
        i {
          display: inline-block;
          width: 2em;
        }
      }
      dd {
        width: 240px;
        text-align: right;
        padding-right: 70px;
        &.price {
          font-size: 20px;
          color: @priceColor;
        }
      }
    }
  }
  .submit {
    text-align: right;
    padding: 60px;
    border-top: 1px solid #f5f5f5;
  }
  </style>
