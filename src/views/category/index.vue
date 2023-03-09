<template>
  <!-- 一级导航页面 顶级类目-->
  <div class="topCategory">
    <div class="container">
      <!-- 面包屑 -->
      <b2c-bread >
        <b2c-bread-item :to="{path:'/'}">首页</b2c-bread-item>
        <b2c-bread-item to="/category/1005000">电器</b2c-bread-item>
        <b2c-bread-item>空调</b2c-bread-item>
      </b2c-bread>
      <!-- 轮播图 -->
      <b2c-carousel></b2c-carousel>
      <!-- 全部分类 -->
      <!-- 各个分类下的推荐商品 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'topCategory'
}
</script>

<style>

</style>
