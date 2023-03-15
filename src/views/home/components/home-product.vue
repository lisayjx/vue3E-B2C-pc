<template>
  <!-- 居家..顶级分类数据 -->
    <div class="home-product"  ref="target">
      <HomePanel :title="cate.name" v-for="cate in result" :key="cate.id">
        <template v-slot:right>
          <div class="sub">
            <RouterLink v-for="sub in cate.children" :key="sub.id" to="/">{{ sub.name }}</RouterLink>
          </div>
          <!-- 查看更多 -->
          <b2c-more />
        </template>
        <div class="box">
          <RouterLink class="cover" to="/">
            <img v-lazyLoad="cate.picture" alt="">
            <strong class="label">
              <span>{{ cate.name }}馆</span>
              <span>{{ cate.saleInfo }}</span>
            </strong>
          </RouterLink>
          <!-- home-goods组件 -->
          <ul class="goods-list">
            <li v-for="item in cate.goods" :key="item.id">
              <HomeGoods  :goods="item"/>
            </li>
          </ul>
        </div>
      </HomePanel>
    </div>
  </template>

<script>
import { ref } from 'vue'
import HomePanel from './home-panel'
import HomeGoods from './home-goods'
import { getGoods } from '@/api/home'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeProduct',
  components: { HomePanel, HomeGoods },
  setup () {
    // 数据懒加载 获取goods数据
    const target = ref(null)
    const result = useLazyData(target, getGoods)
    return { result, target }
  }
}
</script>

  <style scoped lang='less'>
  .home-product {
    background: #fff;
    height: 2900px;
    .sub {
      margin-bottom: 2px;
      a {
        padding: 2px 12px;
        font-size: 16px;
        border-radius: 4px;
        &:hover {
          background: @b2cColor;
          color: #fff;
        }
        &:last-child {
          margin-right: 80px;
        }
      }
    }
    .box {
      display: flex;
      .cover {
        width: 240px;
        height: 610px;
        margin-right: 10px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;//防止图片挤压变形,多余裁掉
        }
        .label {
          width: 188px;
          height: 66px;
          display: flex;
          font-size: 18px;
          color: #fff;
          line-height: 66px;
          font-weight: normal;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate3d(0,-100%,0);
          span {
            text-align: center;
            &:first-child {
              width: 76px;
              background: rgba(0,0,0,.9);
            }
            &:last-child {
              flex: 1;
              background: rgba(0,0,0,.7);
            }
          }
        }
      }
      .goods-list {
        width: 990px;
        display: flex;
        flex-wrap: wrap;
        li {
          width: 240px;
          height: 300px;
          margin-right: 10px;
          margin-bottom: 10px;
          &:nth-last-child(-n+4) {
            margin-bottom: 0;
          }
          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }
  }
  </style>
