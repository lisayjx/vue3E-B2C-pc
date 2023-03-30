<template>
    <!-- 个人中心布局容器组件 -->
    <div class="container">
        <!-- 个人中心左侧菜单组件 -->
      <AppMemberAside />
      <article class="article">
        <!-- 路由出口 -->
        <RouterView />
      </article>
    </div>
  </template>
<script>
import AppMemberAside from '@/components/app-member-aside'
export default {
  name: 'MemberLayout',
  components: {
    AppMemberAside
  }
}
</script>
  <style scoped lang="less">
  .container {
    display: flex;
    padding-top: 20px;
    .article {
      width: 1000px;
    }
  }
  </style>
