<template>
     <home-panel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <!-- 具名插槽 右侧-->
      <template #right>
        <!--查看更多 组件 -->
        <b2c-more></b2c-more>
      </template>
      <!-- 下面内容 -->
      <ul class="goods-list">
        <li v-for="item in goods" :key="item.id">
          <RouterLink :to='`/product/${item.id}`'  >
            <img :src="item.picture" alt="">
            <p class="name ellipsis">{{item.name}}</p>
            <p class="price">&yen;{{item.price}}</p>
          </RouterLink>
        </li>
      </ul>
    </home-panel>

</template>

<script>
import { ref } from 'vue'
import { getNew } from '@/api/home'
import HomePanel from './home-panel.vue'
export default {
  name: 'HomeNew',
  components: { HomePanel },
  setup () {
    const goods = ref([]) // 新鲜好物数据列表
    getNew().then(res => {
      goods.value = res.result
    })

    return { goods }
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
    .hoverShadow();//加了全局混入的less函数 在style的mixins里
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
}
</style>
