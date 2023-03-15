<template>
    <div class='b2c-goods-page' v-if="goods">
      <div class="container">
        <!-- 面包屑 -->
        <b2c-bread>
          <b2c-breadItem to="/">首页</b2c-breadItem>
          <b2c-breadItem :to="`/category/${goods.categories[0].id}`">{{goods.categories[1].name}}</b2c-breadItem>
          <b2c-breadItem :to="`/category/sub/${goods.categories[1].id}`">{{goods.categories[0].name}}</b2c-breadItem>
          <b2c-breadItem>{{ goods.name}}</b2c-breadItem>
        </b2c-bread>
        <!-- 商品信息 -->
        <div class="goods-info">
          <!-- 左 -->
          <div class="media">
            <!-- 图片组件 -->
            <goods-image :images="goods.mainPictures"/>
          </div>
          <!-- 右 -->
        <div class="spec"></div>
        </div>
        <!-- 商品推荐组件 为了每次切换商品都重新渲染所以加if-->
        <goods-relevant/>
        <!-- 商品详情 -->
        <div class="goods-footer">
          <div class="goods-article">
            <!-- 商品+评价 -->
            <div class="goods-tabs"></div>
            <!-- 注意事项 -->
            <div class="goods-warn"></div>
          </div>
          <!-- 24热榜+专题推荐 -->
          <div class="goods-aside"></div>
        </div>
      </div>
    </div>
  </template>

<script>
import { nextTick, ref, watch } from 'vue'
import GoodsRelevant from './components/goods-relevant'
import { getGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import GoodsImage from './components/goods-image.vue'

export default {
  name: 'B2cGoodsPage',
  components: { GoodsRelevant, GoodsImage },
  setup () {
    const goods = handleGetGoods()
    return { goods }
  }

}

// 获取商品详情数据
const handleGetGoods = () => {
  const goods = ref(null)
  const route = useRoute()
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件,需要监听
  watch(() => route.params.id, (newVal) => {
    if (newVal && route.path === `/product/${newVal}`) {
      getGoods(route.params.id).then(res => {
        // 下面的代码意思: 能够在每次更换商品数据得时候,让其他组件能重新初始化,以后在每个组件都不用写watch了
        goods.value = null // 让商品数据为null,然后所有使用v-if=goods的组件都可以重新销毁和创建
        nextTick(() => {
          goods.value = res.result
        })
        console.log(res.result)
      })
    }
  }, { immediate: true })
  return goods
}
</script>

  <style scoped lang='less'>
 .goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
  .goods-footer {
    display: flex;
    margin-top: 20px;
    .goods-article {
      width: 940px;
      margin-right: 20px;
    }
    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }
  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }
  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }
  </style>