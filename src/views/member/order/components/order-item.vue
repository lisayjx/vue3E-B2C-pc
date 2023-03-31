<template>
  <div class="order-item">
        <div class="head">
          <span>下单时间：{{ order.createTime}}</span>
          <span>订单编号：{{ order.id}}</span>
          <span class="down-time">
             <!-- 订单是待付款时候显示倒计时 -->
            <i v-if="order.orderState===1"  class="iconfont icon-down-time"></i>
            <b v-if="order.orderState===1">付款截止：{{ timeText}}</b>
          </span>
          <!-- 已完成 已取消 显示删除,includes表示5或者6中有没有后面的状态 有任何一个就true -->
           <a v-if="[5,6].includes(order.orderState)" href="javascript:;">删除</a>
        </div>
        <div class="body">
          <div class="column goods">
            <ul>
              <li v-for="goods in order.skus" :key="goods.id">
                <router-link class="image" :to="`/product/${goods.id}`">
                  <img :src="goods.image" alt="" />
                </router-link>
                <div class="info">
                  <p class="name ellipsis-2">{{ goods.name}}</p>
                  <p class="attr ellipsis">
                    {{ goods.attrsText}}
                  </p>
                </div>
                <div class="price">¥ {{ goods.realPay}}</div>
                <div class="count">x {{ goods.quantity}}</div>
              </li>
            </ul>
          </div>
          <div class="column state">
            <!-- 发现 索引和静态label正好对上 -->
            <p>{{ orderStatus[order.orderState].label}}</p>
            <!-- 待收货-查看物流 -->
            <!-- 待评价-评价商品 -->
            <!-- 已完成-查看评价 -->
            <p v-if="order.orderState===3"><a href="javascript:;" class="green">查看物流</a></p>
            <p v-if="order.orderState===4"><a href="javascript:;" class="green">评价商品</a></p>
            <p v-if="order.orderState===5"><a href="javascript:;" class="green">查看评价</a></p>
          </div>
          <div class="column amount">
            <p class="red">¥{{ order.payMoney}}</p>
            <p>（含运费：¥{{ order.postFee }}）</p>
            <p>在线支付</p>
          </div>
          <div class="column action">
        <!-- 1待支付：立即付款，查看详情，取消订单 -->
        <!-- 2待发货：查看详情，再次购买 -->
        <!-- 3待收货：确认收货，查看详情，再次购买 -->
        <!-- 4待评价：查看详情，再次购买，申请售后 -->
        <!-- 5已完成：查看详情，再次购买，申请售后 -->
        <!-- 6已取消：查看详情 -->
            <B2cButton @click="$router.push(`/member/pay?orderId=${order.id}`)" v-if="order.orderState===1" type="primary" size="small">立即付款</B2cButton>
            <B2cButton v-if="order.orderState===3" type="primary" size="small">确认收货</B2cButton>
            <p ><a href="javascript:;">查看详情</a></p>
            <p v-if="order.orderState===1"><a href="javascript:;">取消订单</a></p>
            <p v-if="[2,3,4,5].includes(order.orderState)"><a href="javascript:;">再次购买</a></p>
            <p v-if="[4,5].includes(order.orderState)"><a href="javascript:;">申请售后</a></p>
          </div>
        </div>
      </div>
</template>

<script>
// 未传该参数或0为全部， 1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消
// const orderStatus = [
//   { name: 'all', label: '全部订单' },
//   { name: 'unpay', label: '待付款' },
//   { name: 'deliver', label: '待发货' },
//   { name: 'receive', label: '待收货' },
//   { name: 'comment', label: '待评价' },
//   { name: 'complete', label: '已完成' },
//   { name: 'cancel', label: '已取消' }
// ]
import { orderStatus } from '@/api/constants'
import { usePayTime } from '@/hooks'
export default {
  name: 'OrderItem',
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    // 倒计时 工具
    const { start, timeText } = usePayTime()
    start(props.order.countdown)
    return { orderStatus, timeText }
  }
}
</script>

<style lang="less" scoped>

.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @b2cColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @b2cColor;
          }
        }
      }
    }
  }
}
</style>
