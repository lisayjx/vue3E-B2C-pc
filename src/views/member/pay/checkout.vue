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
            <a class="my-btn" :class="{active:currDeliveryTimeType===1}" @click="currDeliveryTimeType=1" href="javascript:;">不限送货时间：周一至周日</a>
            <a class="my-btn" :class="{active:currDeliveryTimeType===2}" @click="currDeliveryTimeType=2" href="javascript:;">工作日送货：周一至周五</a>
            <a class="my-btn" :class="{active:currDeliveryTimeType===3}" @click="currDeliveryTimeType=3" href="javascript:;">双休日、假日送货：周六至周日</a>
          </div>
          <!-- 支付方式 -->
           <h3 class="box-title">支付方式</h3>
          <div class="box-body">
            <a class="my-btn" :class="{active:payType===1}" @click="payType=1" href="javascript:;">在线支付</a>
            <a class="my-btn" :class="{active:payType===2}" @click="payType=2" href="javascript:;">货到付款</a>
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
            <B2cButton @click="HandleSubmitOrder" type="primary">提交订单</B2cButton>
          </div>
        </div>
      </div>
    </div>
  </template>
<script>

import CheckoutAddress from './components/checkout-address.vue'
import { ref, reactive } from 'vue'
import { createOrder, submitOrder, findOrderRepurchase } from '@/api/order.js'
import Message from '@/components/library/Message'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'B2cPayCheckoutPage',
  components: { CheckoutAddress },
  setup () {
    const currDeliveryTimeType = ref(1)// 当前点击的配送时间 1为不限，2为工作日，3为双休或假日
    const payType = ref(1)// 当前点击支付方式 1为在线支付，2为货到付款
    const route = useRoute()
    // 结算功能-生成订单-订单信息
    // 如果有订单传来就是点击再次购买传来的 就要以这个订单里的信息生成订单信息
    // 如果没有传来的订单id，就是购物车选中的进行结算
    const order = ref(null)
    if (route.query.orderId) {
    // 再次购买结算
      findOrderRepurchase(route.query.orderId).then(res => {
        order.value = res.result
        // 设置订单商品数据
        reqParams.goods = res.result.goods.map(item => {
          return {
            skuId: item.skuId,
            count: item.count
          }
        })
      })
    } else {
      // 购物车结算
      createOrder().then(res => {
      //   console.log(res.result) goods:[{},{}..] ,summary：{}，userAddresses：[]
        order.value = res.result
        //   把商品每一项设置成 提交表单时候 需要的数据格式
        reqParams.goods = res.result.goods.map(item => {
          return {
            skuId: item.skuId,
            count: item.count
          }
        })
      })
    }

    // 切换收货地址
    // 1.组件初始化的时候需要得到一个默认的地址ID通知给结算组件
    // 2.对话框中渲染一个地址列表
    // 3.实现可以选中的效果，点击确认后变更显示地址，通知结算组件地址ID

    //    需要提交到后端的字段
    const reqParams = reactive({
      addressId: null, // 收货地址，切换收货地址或者组件默认的时候设置
      deliveryTimeType: 1, // 配送时间类型，1为不限，2为工作日，3为双休或假日
      payType: 1, // 支付方式，1为在线支付，2为货到付款
      buyerMessage: '', // 买家留言
      goods: []// 商品信息，在上面获取数据时候设置了需要传给后端的数据格式
    })
    // 收到子组件在此页面初始化 时候 和修改选中时候传来的地址id
    const changeAddress = (addressId) => {
      reqParams.addressId = addressId
    }

    // 提交订单
    const router = useRouter()
    const HandleSubmitOrder = () => {
      if (!reqParams.addressId) return Message({ text: '请选择收货地址' })
      submitOrder(reqParams).then(res => {
        // 返回来的数据： 订单id，payType支付方式，payChannel支付渠道
        // 跳转到支付页
        router.push({ path: '/member/pay', query: { id: res.result.id } })
      })
    }

    return { createOrder, order, changeAddress, HandleSubmitOrder, currDeliveryTimeType, payType }
  }
}
// 点击再次购买
// 当你点击再次购买，传递订单ID到结算页面
// 在结算页码根据地址栏是否有订单ID来判断结算方式
// 没有ID：结算购物车种选中的商品
// 如有ID：结算该订单ID下的商品
// 提供一个API函数去生成结算信息

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
