<template>
    <div class="b2c-cart-page">
      <div class="container">
        <!-- 面包屑 -->
        <B2cBread>
          <B2cBreadItem to="/">首页</B2cBreadItem>
          <B2cBreadItem>购物车</B2cBreadItem>
        </B2cBread>
        <!-- 购物车 -->
        <div class="cart">
          <table>
            <thead>
              <tr>
                <th width="120" >
                    <B2cCheckbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</B2cCheckbox>
                </th>
                <th width="400">商品信息</th>
                <th width="220">单价</th>
                <th width="180">数量</th>
                <th width="180">小计</th>
                <th width="140">操作</th>
              </tr>
            </thead>
            <!-- 有效商品 -->
            <tbody>
              <tr v-for="validGoods in $store.getters['cart/validList']" :key="validGoods.skuId">
                <td><B2cCheckbox @change="($event)=>checkOne(validGoods.skuId,$event)" :modelValue="validGoods.selected"/></td>
                <td>
                  <div class="goods">
                    <RouterLink :to="`/product/${validGoods.id}`"><img :src="validGoods.picture" alt=""></RouterLink>
                    <div>
                      <p class="name ellipsis">{{validGoods.name  }}</p>
                     <!-- 选择规格组件 -->
                    <CartSku @change="$event=>updateCartSku(validGoods.skuId,$event)" :attrsText="validGoods.attrsText" :skuId="validGoods.skuId"/>
                    </div>
                  </div>
                </td>
                <td class="tc">
                  <p>&yen;{{ validGoods.nowPrice }}</p>
                  <p v-if="validGoods.price-validGoods.nowPrice>0">比加入时降价 <span class="red">&yen;{{  validGoods.price-validGoods.nowPrice}}</span></p>
                </td>
                <td class="tc">
                  <!-- 数量 -->
                  <B2cNumbox @change="$event=>updateCount(validGoods.skuId,$event)" :max="validGoods.stock" :modelValue="validGoods.count"/>
                </td>
                <td class="tc"><p class="f16 red">&yen;{{ Math.round(validGoods.nowPrice*100)*validGoods.count/100 }}</p></td>
                <td class="tc">
                  <p><a href="javascript:;">移入收藏夹</a></p>
                  <p><a @click="deleteCart(validGoods.skuId)" class="green" href="javascript:;">删除</a></p>
                  <p><a href="javascript:;">找相似</a></p>
                </td>
              </tr>
                <!-- 空 -->
            <tr v-if="$store.getters['cart/validList'].length===0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            </tbody>
            <!-- 无效商品 -->
            <tbody v-if="$store.getters['cart/inValidList'].length">
              <tr><td colspan="6"><h3 class="tit">失效商品</h3></td></tr>
              <tr v-for="inValidGoods in $store.getters['cart/inValidList']" :key="inValidGoods.skuId">
                <td><B2cCheckbox  @change="($event)=>checkOne(goods.inValidGoods,$event)" style="color:#eee;" /></td>
                <td>
                  <div class="goods">
                    <RouterLink :to="`/product/${inValidGoods.id}`"><img :src="inValidGoods.picture" alt=""></RouterLink>
                    <div>
                      <p class="name ellipsis">{{ inValidGoods.name}}</p>
                      <p class="attr">{{inValidGoods.attrsText}}</p>
                    </div>
                  </div>
                </td>
                <td class="tc"><p>&yen;{{inValidGoods.nowPrice}}</p></td>
              <td class="tc">{{inValidGoods.count}}</td>
              <td class="tc"><p>&yen;{{inValidGoods.nowPrice*100*inValidGoods.count/100}}</p></td>
              <td class="tc">
                  <p><a @click="deleteCart(inValidGoods.skuId)" class="green" href="javascript:;">删除</a></p>
                  <p><a href="javascript:;">找相似</a></p>
                </td>
              </tr>
                <!-- 空 -->
            <tr v-if="$store.getters['cart/inValidList'].length===0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            </tbody>

          </table>
        </div>
        <!-- 操作栏 -->
        <div class="action">
          <div class="batch">
            <B2cCheckbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</B2cCheckbox>
            <a @click="batchDeleteCart()" href="javascript:;">删除商品</a>
            <a href="javascript:;">移入收藏夹</a>
            <a  @click="batchDeleteCart(true)" href="javascript:;">清空失效商品</a>
          </div>
          <div class="total">
            共 {{$store.getters['cart/validTotal']}} 件商品，已选择 {{$store.getters['cart/selectedTotal']}} 件，商品合计：
          <span class="red">¥{{$store.getters['cart/selectedAmount']}}</span>
            <B2cButton @click="checkout" type="primary">下单结算</B2cButton>
          </div>
        </div>
        <!-- 猜你喜欢 -->
        <GoodRelevant />
      </div>
    </div>

  </template>
<script>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import { useStore } from 'vuex'
import CartNone from './components/cart-none.vue'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
import CartSku from './components/cart-sku'
import { useRouter } from 'vue-router'

export default {
  name: 'B2cCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    // 单选
    const store = useStore()
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 全选
    const checkAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    // 删除
    const deleteCart = (skuId) => {
      Confirm({ title: '提示信息', text: '您确定要删除此商品吗？' }).then(ok => {
        // 点击确定
        // 如果在下面点击删除商品，只能看现在选中了谁
        store.dispatch('cart/deleteCart', skuId)
        Message({ type: 'success', text: '删除成功' })
      }).catch(cancel => {
        // 点击取消
        console.log('cancel')
      })
    }
    // 勾选，批量删除（也支持清空无效商品传来true就是清空无效商品）
    // isClear为true删除无效商品列表，如果没传就是删除选中的
    const batchDeleteCart = (isClear) => {
      Confirm({ title: '提示信息', text: `您确定要删除${isClear ? '失效' : '选中'}的商品吗？` }).then(ok => {
        // 点击确定
        store.dispatch('cart/batchDeleteCart', isClear)// 告诉vuex是否是清无效的
        Message({ type: 'success', text: `${isClear ? '清空' : '删除'}成功` })
      }).catch(cancel => {
        // 点击取消
        console.log('cancel')
      })
    }

    // 修改数量
    const updateCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }
    // 更新规格 购物车的sku
    const updateCartSku = (oldSkuId, newSku) => {
      // oldSkuId是老的购物车skuId
      // newSku是 currSku，是子组件car-sku传来的新的sku数据，但是信息是5个属性，缺少 后续还要从老的购物车商品信息中合并
      store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
    }
    // 下单结算
    const router = useRouter()
    const checkout = () => {
      // 1.提示至少选中一件商品
      // 2.弹出确认框，是否需要去结算
      // 3.跳转到结算页面（需要做路由守卫）
      if (store.getters['cart/selectedList'].length === 0) {
        return Message({ text: '至少选中一样商品' })
      }
      Confirm({ text: '下单结算需要登陆，是否去结算？' }).then(res => {
        router.push('/member/checkout')
      }).catch(e => console.log(e))
    }
    return { checkOne, checkAll, deleteCart, batchDeleteCart, updateCount, updateCartSku, checkout }
  }
}
</script>
  <style scoped lang="less">
  .tc {
    text-align: center;
    .b2c-numbox {
      margin: 0 auto;
      width: 120px;
    }
  }
  .red {
    color: @priceColor;
  }
  .green {
    color: @b2cColor
  }
  .f16 {
    font-size: 16px;
  }
  .goods {
    display: flex;
    align-items: center;
    img {
      width: 100px;
      height: 100px;
    }
    > div {
      width: 280px;
      font-size: 16px;
      padding-left: 10px;
      .attr {
        font-size: 14px;
        color: #999;
      }
    }
  }
  .action {
    display: flex;
    background: #fff;
    margin-top: 20px;
    height: 80px;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    padding: 0 30px;
    .b2c-checkbox {
      color: #999;
    }
    .batch {
      a {
        margin-left: 20px;
        &:hover{
            color: @b2cColor;
        }
      }
    }
    .red {
      font-size: 18px;
      margin-right: 20px;
      font-weight: bold;
    }
  }
  .tit {
    color: #666;
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
  }
  .b2c-cart-page {
    .cart {
      background: #fff;
      color: #666;
      table {
        border-spacing: 0;
        border-collapse: collapse;
        line-height: 24px;
        th,td{
          padding: 10px;
          border-bottom: 1px solid #f5f5f5;
          &:first-child {
            text-align: left;
            padding-left: 30px;
            color: #999;
          }
        }
        th {
          font-size: 16px;
          font-weight: normal;
          line-height: 50px;
        }
      }
    }
  }
  </style>
