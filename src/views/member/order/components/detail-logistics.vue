<template>
    <div class="detail-logistics">
      <p v-if="logisticsInfo">
        <!-- 最新时间地点 -->
        <span>{{logisticsInfo[logisticsInfo.length-1].time}}</span>
        <span>{{logisticsInfo[logisticsInfo.length-1].text}}</span>
      </p>
      <a href="javascript:;">查看物流</a>
    </div>

    <!-- 物流组件 -->
    <OrderLogistics/>
  </template>
<script>
import { ref } from 'vue'
import OrderLogistics from './order-logistics.vue'
import { logisticsOrder } from '@/api/order'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  async setup (props) {
    // 获取物流信息
    const logisticsInfo = ref(null)
    const res = await logisticsOrder(props.order.id)
    logisticsInfo.value = res.result.list
    return { logisticsInfo }
  }
}
</script>
  <style scoped lang="less">
  .detail-logistics {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background-color: #f5f5f5;
    margin: 30px 50px 0;
    > p {
      flex: 1;
      span {
        color: #999;
        &:first-child {
          margin-right: 30px;
        }
      }
    }
    > a {
      color: @b2cColor;
      text-align: center;
    }
  }
  </style>
