<template>

    <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{attrsText}}</span>
        <i class="iconfont icon-angle-down"></i>
      </div>
         <!-- 购物车页面 鼠标点击弹出的规格 -->
      <div class="layer" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <!-- 规格组件 -->
      <!-- 这里传:skuId="skuId" 是为了要做默认选中的 -->
      <GoodsSku v-else @change="updateSku"  :skuId="skuId" :goods="goods" />
      <B2cButton v-if="goods" @click="ok" type="primary" size="mini" style="margin-left:60px">确认</B2cButton>
    </div>
    </div>
  </template>
<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/cart'
import GoodsSku from '../../goods/components/goods-sku.vue'

export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const goods = ref(null)
    const visible = ref(false)
    const target = ref(null)
    const loading = ref(false)
    const show = () => {
      visible.value = true
      loading.value = true
      // 获取获取商品的specs和skus，渲染的到弹出框
      // 获取当前spec和sku数据
      getSpecsAndSkus(props.skuId).then(res => {
        goods.value = res.result
        loading.value = false
      })
    }
    const hide = () => {
      visible.value = false
      goods.value = null
    }
    const toggle = () => {
      visible.value ? hide() : show()
    }
    // 点到target的外部就隐藏
    onClickOutside(target, () => {
      hide()
    })
    // 监听sku改变的函数,记录sku信息
    const currSku = ref(null)
    const updateSku = (sku) => {
      currSku.value = sku
    }
    // 点击确认后，把更改后的sku信息提交给父组件（购物车组件）
    // 当currSku有值不等于{}，且currSkuId和默认的skuId不同,才回去通知父组件
    const ok = () => {
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        emit('change', currSku.value)// 此时给父组件的信息是5个属性，缺少 后续还要从老的购物车商品信息中合并
      }
      hide()
    }
    return { visible, show, hide, toggle, target, goods, loading, updateSku, ok }
  }

}
</script>
  <style scoped lang="less">
  .cart-sku {
    height: 28px;
    border: 1px solid #f5f5f5;
    padding: 0 6px;
    position: relative;
    margin-top: 10px;
    display:inline-block;
    .attrs {
      line-height: 24px;
      display: flex;
      span {
        max-width: 230px;
        font-size: 14px;
        color: #999;
      }
      i {
        margin-left: 5px;
        font-size: 14px;
      }
    }
    .layer {
      position: absolute;
      left: -1px;
      top: 40px;
      z-index: 10;
      width: 400px;
      border: 1px solid @b2cColor;
      box-shadow: 2px 2px 4px lighten(@b2cColor,50%);
      background: #fff;
      border-radius: 4px;
      font-size: 14px;
      padding: 20px;
      &::before {
        content: "";
        width: 12px;
        height: 12px;
        border-left: 1px solid @b2cColor;
        border-top: 1px solid @b2cColor;
        position: absolute;
        left: 12px;
        top: -8px;
        background: #fff;
        transform: scale(.8,1) rotate(45deg);
      }
      .loading {
        height: 224px;
        background: url(../../../assets/images/loading.gif) no-repeat center;
      }
    }
  }
  </style>
