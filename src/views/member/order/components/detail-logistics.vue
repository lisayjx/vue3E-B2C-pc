<template>
    <div class="detail-logistics">
      <p v-if="logisticsInfo">
        <!-- 最新时间地点 -->
        <span>{{logisticsInfo[logisticsInfo.length-1].time}}</span>
        <span>{{logisticsInfo[logisticsInfo.length-1].text}}</span>
      </p>
      <a href="javascript:;" @click="watchLogistics(order)">查看物流</a>
    </div>

    <!-- 物流组件 -->
    <!-- to中写id选择器，把此组件传送到这个选择器中,在public得index里 -->
   <Teleport to='#model'>
    <OrderLogistics ref="logisticsDom"/>
   </Teleport>
  </template>
<script>
import { ref } from 'vue'
import { logisticsOrder } from '@/api/order'
// 导入查看物流组件
import OrderLogistics from './order-logistics.vue'
// 引入打开查看物流得逻辑代码
import { useLogisticsOrder } from '../index.vue'
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
    // 查看物流...useLogisticsOrder()从index导入来的代码
    // 因为在index页得useLogisticsOrder是写在setup外的 用函数包裹起来的代码 所以需要...
    return { logisticsInfo, ...useLogisticsOrder() }
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
