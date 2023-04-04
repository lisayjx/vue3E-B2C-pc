<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{goodsId?'同类商品推荐':'猜你喜欢'}}</span>
    </div>
    <!-- 此处使用改造后的b2c-carousel.vue -->
    <b2c-carousel :sliders="sliders"></b2c-carousel>
  </div>
</template>

<script>
// 传入了goodsId就是商品推荐,没传就是猜你喜欢
import { ref } from 'vue'
import { getRelGoods } from '@/api/product'
export default {
  // 同类推荐，猜你喜欢
  name: 'GoodsRelevant',
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const sliders = goodsList(props.goodsId)
    return { goodsList, sliders }
  }
}
const goodsList = (goodsId) => {
  // 需要数据类型是[[4个商品],[],[],[]],之后把sliders提供给轮播图使用
  const sliders = ref([])

  getRelGoods(goodsId).then(res => {
    // console.log(res.result)
    // 每页4条,res.result一共16条没分页的数据[16个商品]
    const pageSize = 4
    const pageCount = Math.ceil(res.result.length / pageSize)// 4页
    for (let i = 0; i < pageCount; i++) {
      sliders.value.push(res.result.slice(i * pageSize, (i + 1) * pageSize))
      // slice从哪截到哪
    }
  })
  return sliders
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @b2cColor;
      border-right: 4px solid @b2cColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@b2cColor, 40%);
      }
    }
  }
}
:deep(.b2c-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      bottom: 30px;
      span {
        &.active {
          background: @b2cColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0,0,0,0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>
