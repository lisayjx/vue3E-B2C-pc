<template>
  <div class="goods-tabs">
    <nav>
      <a @click="activeName = 'goodsDetail'" :class="{ active: activeName === 'goodsDetail' }" href="javascript:;">商品详情</a>
      <a @click="activeName = 'goodsComment'" :class="{ active: activeName === 'goodsComment' }"
        href="javascript:;">商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 切换内容的地方,动态组件切换 -->
    <!--在vue中动态的去切换组件其实可以使用动态组件component组件-->
    <!-- is属性用来决定component动态组件渲染为那个组件，组件的名称 -->
    <!-- <goods-detail v-if="activeName === 'detail'" />
    <goods-comment v-if="activeName === 'comment'" /> -->
    <!-- 当在这些组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复重洁染导致的性能问题。
    重新创建动态组件的行为通常是非常有用的，但是在这个案例中，
    我们更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来。
    为了解决这个问题，我们可以用一个<keep-alive元素将其动态组件包裹起来。 -->
    <keep-alive>
      <component :is="activeName" :goodsList="goodsList"></component>
    </keep-alive>
  </div>
</template>

<script>
import { inject, ref } from 'vue'
import goodsDetail from './goods-detail.vue'
import goodsComment from './goods-comment.vue'
export default {
  name: 'GoodsTabs',
  components: { goodsDetail, goodsComment },
  setup () {
    // activeName控制谁被激活 detail-->详情   comment-->评价
    const activeName = ref('goodsDetail')
    // 收到祖先注入的goods
    const goods = inject('goods')
    return { activeName, goods }
  }

}
</script>

<style scoped lang="less">
.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }

      &:first-child {
        border-right: 1px solid #f5f5f5;
      }

      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @b2cColor;
        }
      }
    }
  }
}</style>
