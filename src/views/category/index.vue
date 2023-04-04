<template>
  <!-- 一级导航页面 顶级类目-->
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <b2c-bread>
        <!-- 默认插槽内容 -->
        <b2c-bread-item :to="{ path: '/' }">首页</b2c-bread-item>
        <transition name="fade-right" mode="out-in">
          <!-- 动画不生效是，结点的文字变化了，节点并没变化，想让节点也就是这个组件变化，加key -->
          <!-- key变化时候,唯一标识不同，就说明节点要重新创建了，跟虚拟dom有关 -->
          <!-- 但是动画有一瞬间卡住了，会有先后执行顺序，现在是一起执行了，需要改变。先移除节点，然后创建节点， -->
          <!-- mode="out-in"动画模式，先出后进 -->
          <b2c-bread-item :key="topCategory.id">{{ topCategory.name }}</b2c-bread-item>
        </transition>
      </b2c-bread>
      <!-- 轮播图 -->
      <b2c-carousel :sliders="sliders" style="height: 500px"></b2c-carousel>

      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <a href="javascript:;">
              <img v-lazyLoad="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="item in subList" :key="item.id">
        <div class="head">
          <h3>- {{ item.name }} -</h3>
          <p class="tag">温暖柔软 品质之选</p>
          <!-- 查看更多组件 -->
          <b2c-more />
        </div>
        <div class="body">
          <!-- 各个商品组件 -->
          <goods-item v-for="good in item.goods" :key="good.id" :good="good" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 顶级类目页： 和首页（home）平级得顶级类目页 负责，1.点击顶级类目，拿到顶级类目下得数据
import { getBanner } from '@/api/home'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import GoodsItem from './components/goods-item.vue'
import { getTopCategory } from '@/api/category'
export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup () {
    // 轮播图
    const sliders = ref([])
    getBanner().then((res) => {
      sliders.value = res.result
    })
    // 面包屑+拿到当前分类===》vuex
    // route.params.id拿到上一页页面点击然后传过来的id
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => { // 当前点击那项分类，比如居家，美食
      let cate = {}
      const item = store.state.category.list.find(item => item.id === route.params.id)
      if (item) cate = item
      return cate
    })
    // 拿到每个顶级类目得数据，就是点击居家或者美食..出现的数据
    const subList = ref([])// 各个点击顶级分类后，顶级分类下得数据
    const getSubList = () => {
      getTopCategory(route.params.id).then((res) => {
        subList.value = res.result.children
        // console.log(res.result)
      })
    }

    // 监听id的变化，只要有新id出现就请求数据getSubList()
    watch(
      () => route.params.id,
      (newVal) => {
        // 有id并且在顶级类目下才会发请求
        if (newVal && `/category/${newVal}` === route.path) {
          getSubList()
        }
      },
      { immediate: true }
    ) // 一进来就要触发watch
    return { sliders, topCategory, subList }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @b2cColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .b2c-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
