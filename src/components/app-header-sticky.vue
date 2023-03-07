<template>
    <div class="app-header-sticky" :class="{show:y>=78}">
      <div class="container" v-show="y>78">
        <RouterLink class="logo" to="/" />
        <!-- 引入头部导航组件 -->
        <AppHeaderNav />
        <div class="right">
          <RouterLink to="/" >品牌</RouterLink>
          <RouterLink to="/" >专题</RouterLink>
        </div>
      </div>
    </div>
  </template>

<script>
import { onMounted, ref } from 'vue'
import AppHeaderNav from './app-header-nav'
export default {
  name: 'AppHeaderSticky',
  components: { AppHeaderNav },
  setup () {
    // 记录y轴卷去头部高度
    const y = ref(0)
    onMounted(() => {
      // 当你页面滚动的时候更新他
      window.onscroll = () => {
        y.value = document.documentElement.scrollTop
      }
    })
    return { y }
  }
}
</script>

  <style scoped lang='less'>
  .app-header-sticky {
    width: 100%;
    height: 80px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
    // 默认移出顶部且完全透明。
    transform: translateY(-100%);
    opacity: 0;
    // 定义一个类回到默认吸顶位置完全显示
    &.show{
        transition: all 0.3s linear;
        transform:none;
        opacity: 1;
    }
    .container {
      display: flex;
      align-items: center;
    }
    .logo {
      width: 200px;
      height: 80px;
      background: url(../assets/images/logo.png) no-repeat  right 2px;
      background-size: 160px auto;
    }
    .right {
      width: 220px;
      display: flex;
      text-align: center;
      padding-left: 40px;
      border-left: 2px solid @b2cColor;
      a {
        width: 38px;
        margin-right: 40px;
        font-size: 16px;
        line-height: 1;
        &:hover {
          color: @b2cColor;
        }
      }
    }
  }
  </style>
