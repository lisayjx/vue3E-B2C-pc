<template>
  <!-- 顶部通栏组件 -->
  <app-topnav></app-topnav>
  <!-- 头部 -->
  <app-header></app-header>
  <!-- 吸顶头部 -->
  <app-header-sticky></app-header-sticky>

  <main class="app-body">
    <!-- 二级路由出口（除了顶部底部，变化的那部分得出口） -->
    <router-view></router-view>
  </main>
 <!-- 底部 -->
 <app-footer></app-footer>
</template>

<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'b2c-layout',
  components: { AppTopnav, AppHeader, AppFooter, AppHeaderSticky },
  setup () {
    const store = useStore()
    store.dispatch('category/getCategoryList')// 调用actions的getCategoryList,获取头部导航分类列表
  }
}
</script>

<style scoped lang="less">
.app-body{
  min-height: 600px;
}
</style>
