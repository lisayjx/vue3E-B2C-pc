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
            <!-- 商品销售情况组件 -->
            <goods-sales/>
          </div>
          <!-- 右 -->
        <div class="spec">
          <!-- 商品名字组件 -->
          <goods-name  :goods="goods"/>
          <!-- 商品规格SKU skuId="1369155865461919746" 测试选中-->
          <goods-sku :goods="goods"   @change="changeSku"/>
        <!-- 商品数量 组件 -->
        <b2c-numbox label="数量" v-model="num" :max="goods.inventory"></b2c-numbox>
        <!-- 按钮组件 -->
        <b2c-button @click="insertCart" type="primary" style="margin-top: 20px;">加入购物车</b2c-button>
        </div>
        </div>
        <!-- 商品推荐组件 -->
         <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id"/>
        <!-- 商品详情 -->
        <div class="goods-footer">
          <div class="goods-article">
            <!-- 商品+评价 -->
          <goods-tabs />
            <!-- 注意事项 -->
            <div class="goods-warn">
              <GoodsWarn/>
            </div>
          </div>
          <!-- 24热榜+周热榜 -->
          <div class="goods-aside">
            <goods-hot :goodsId="goods.id" :type="1"/>
            <goods-hot :goodsId="goods.id" :type="2"/>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import { nextTick, ref, watch, provide } from 'vue'
import GoodsRelevant from './components/goods-relevant'
import { getGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import Message from '@/components/library/Message'
export default {
  name: 'B2cGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    // 1.获取商品信息
    const goods = handleGetGoods()
    // 2.得到子组件goods-sku传来的规格信息,每次我们点击规格都会变化
    const changeSku = (sku) => {
      // console.log(sku)// 如果规格选择不完整就是个{},完整的话就是包括原价现价库存规格属性的对象
      // 修改商品的原价,现价,库存,不同规格不同价格
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      currSku.value = sku // 把选择完毕后的的sku记录下来
    }
    // 提供goodsList给后代使用
    provide('goods', goods)

    // 选择的数量 组件
    const num = ref(1)

    // 加入购物车
    const store = useStore()
    const currSku = ref(null) // 当前的sku，完整里有5个数据，不完整是{}
    const insertCart = () => {
      // 判断用户选择的规格是否完整，不完整不能加入购物车
      // 组件goods-sku传来的sku，如果是{}那就是不完整的
      // 完整
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart', {
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        }).then(() => {
          Message({ type: 'success', text: '加入购物车成功' })
        })
      } else {
        // 不完整的
        Message({ text: '请选择完整规格' })
      }
    }
    return { goods, changeSku, num, insertCart, currSku }
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
