<template>
  <div class="">
    <!-- <体验jsx语法 -->
    <!-- 引入选项卡组件，里面放默认插槽内容panel组件 -->
    <!-- 别在b2c-tabs里随意加注释 否则在b2c-tabs里写的jsx语句会出错 -->
    <b2c-tabs v-model="activeName" @tab-click="changeTab">
      <b2c-tabs-panel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></b2c-tabs-panel>
    </b2c-tabs>
    <!-- 订单列表 ：没写上面的b2c-tabs-panel组件里 因为 上面只是个摆设 我们不做 那么多 只做all得那个选项得列表 -->
    <div class="order-list">
      <!-- 加载 -->
       <div v-if="loading" class="loading"></div>
       <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
        <!-- 内容 order-item组件 -->
        <orderItem v-for="item in orderList" :key="item.id" :order="item"/>
    </div>
    <!-- 分页组件 -->
    <b2c-pagination v-if="total>0" @CurrentChange="changeCurrentPage" :total="total" :currentPage="requestParams.page" :pageSize="requestParams.pageSize"></b2c-pagination>
  </div>
</template>

<script>
// 完成tab切换加载
// 完成加载中，无数据处理
// 完成分页加载
import { reactive, ref, watch } from 'vue'
import { findOrderList } from '@/api/order'
import { orderStatus } from '@/api/constants'
import orderItem from './components/order-item.vue'
export default {
  name: 'MemberOrder',
  components: { orderItem },
  setup () {
    // 激活的选项卡的名字
    const activeName = ref('all')
    // 点击切换选项卡
    // 此时：tab.index 就是订单的状态 因为数字一样
    const changeTab = (index) => { // b2c-tabs传来的
      // 由订单状态 更新数据
      console.log(index)
      requestParams.orderState = index
      requestParams.page = 1
    }
    // 查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0// 1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
    })
    // 订单列表
    const orderList = ref([])
    const total = ref(0)// 数据总条数
    const loading = ref(false)
    // 获取我的订单列表 查询订单，监听订单参数的变化 实时更新请求数据
    watch(requestParams, () => {
      loading.value = true
      findOrderList(requestParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false // 获取到数据时候加载结束
      })
    }, { immediate: true })

    //  点击切换页
    const changeCurrentPage = (currPage) => {
      requestParams.page = currPage
    }
    return { activeName, changeTab, orderStatus, orderList, total, loading, requestParams, changeCurrentPage }
  }

}
</script>

<style scoped lang="less">
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
  background-color: #fff;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/load1.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
