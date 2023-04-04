<template>
    <LoginHeader>注册</LoginHeader>

    <section class="container" >
      <nav class="tab">
        <a  :class="active" href="javascript:;">
          <i class="iconfont icon-edit" />
          <span>请完善资料</span>
        </a>
      </nav>

      <div class="tab-content" >
        <RegisterPatch />
      </div>
    </section>
    <LoginFooter />
  </template>

<script>

import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import RegisterPatch from './components/register-patch.vue'

export default {
  name: 'PageCallback',
  components: { LoginHeader, LoginFooter, RegisterPatch }

}
</script>

  <style scoped lang='less'>
  .container {
    padding: 25px 0;
  }
  .tab {
    background: #fff;
    height: 80px;
    padding-top: 40px;
    font-size: 18px;
    text-align: center;
    a {
      color: #666;
      display: inline-block;
      width: 350px;
      line-height: 40px;
      border-bottom: 2px solid #e4e4e4;
      i {
        font-size: 22px;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        margin-left: 4px;
      }
      &.active {
        color: @b2cColor;
        border-color: @b2cColor;
      }
    }
  }
  .tab-content {
    min-height: 600px;
    background: #fff;
  }
  .container {
  padding: 25px 0;
  position: relative;
  height: 730px;

}
  </style>
