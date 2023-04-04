<template>
    <div class="goods-hot">
      <h3>{{title}}</h3>
      <div v-if="goodsList">
        <GoodsItem v-for="item in goodsList" :key="item.id" :good="item"/>
      </div>
    </div>
  </template>
<script>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import GoodsItem from '../../category/components/goods-item.vue'
import { getHotGoods } from '@/api/product'
export default {
  name: 'GoodsHot',
  components: { GoodsItem },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    const titleObj = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    const title = computed(() => {
      return titleObj[props.type]
    })
    // 商品列表
    const route = useRoute()
    const goodsList = ref([])
    getHotGoods({ id: route.params.id, type: props.type }).then(res => {
      goodsList.value = res.result
    })
    return { title, goodsList }
  }
}
</script>
  <style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item)  {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
