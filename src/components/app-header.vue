<template>
    <header class='app-header'>
      <div class="container">
        <h1 class="logo"><router-link to="/">b2c电商平台</router-link></h1>
      <!-- 导航组件 -->
      <app-header-nav></app-header-nav>
      <!-- 搜索 -->
        <div class="search">
          <i class="iconfont icon-search"></i>
          <input type="text" placeholder="搜一搜">
        </div>
        <!-- 购物车图标和弹窗 -->
        <AppHeaderCart />
      </div>
    </header>
  </template>

<script>
import AppHeaderNav from '@/components/app-header-nav.vue'
import AppHeaderCart from './app-header-cart'
export default {
  name: 'AppHeader',
  components: { AppHeaderNav, AppHeaderCart }
}
</script>

  <style scoped lang='less'>
  .app-header {
    background: #fff;
    .container {
      display: flex;
      align-items: center;
    }
    .logo {
      width: 200px;
      a {
        display: block;
        height: 132px;
        width: 100%;
        text-indent: -9999px;//隐藏网站名字，写网站名为了SEO
        // background: url(../assets/images/logo.png) no-repeat center 18px / contain;
        background: url(../assets/images/logo.png) no-repeat  center -30px;
        background-size: 320px 220px;
      }
    }

    .search {
      width: 170px;
      height: 32px;
      position: relative;
      border-bottom: 1px solid #e7e7e7;
      line-height: 32px;
      .icon-search {
        font-size: 18px;
        margin-left: 5px;
      }
      input {
        width: 140px;
        padding-left: 5px;
        color: #666;
      }
    }
    .cart {
      width: 50px;
      .curr {
        height: 32px;
        line-height: 32px;
        text-align: center;
        position: relative;
        display: block;
        .icon-cart{
          font-size: 22px;
        }
        em {
          font-style: normal;
          position: absolute;
          right: 0;
          top: 0;
          padding: 1px 6px;
          line-height: 1;
          background: @helpColor;
          color: #fff;
          font-size: 12px;
          border-radius: 10px;
          font-family: Arial;
        }
      }
    }
  }
  </style>
