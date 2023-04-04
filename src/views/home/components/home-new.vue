<template>
  <home-panel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
    <!-- 具名插槽 右侧-->
    <template #right>
      <!--查看更多 组件 -->
      <b2c-more></b2c-more>
    </template>
    <div style="position: relative;height: 406px;" ref="target">
      <!-- 动画 -->
      <transition name="fade">
        <!-- 下面内容 -->
        <ul class="goods-list" v-if="goods.length" ref="panel">
          <li v-for="item in goods" :key="item.id">
            <RouterLink :to='`/product/${item.id}`'>
              <img v-lazyLoad="item.picture"   alt="">
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
        <!-- 骨架屏 -->
        <home-skeleton v-else></home-skeleton>
      </transition>
    </div>
  </home-panel>
</template>

<script>
import { ref } from 'vue'
import { getNew } from '@/api/home'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    // const goods = ref([]) // 新鲜好物数据列表
    // getNew().then(res => {
    //   goods.value = res.result
    // })
    const target = ref(null)// 获取dom元素
    const result = useLazyData(target, getNew)// 把dom元素和api函数传过去，得到结果
    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow(); //加了全局混入的less函数 在style的mixins里

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }

    .price {
      color: @priceColor;
    }
  }
}</style>
