<template>
    <!-- 头部组件 -->
    <LoginHeader>欢迎登录</LoginHeader>
    <!-- 主体部分 -->
    <section class="login-section">
        <div class="wrapper">
            <nav>
                <a @click="activeName='account'" href="javascript:;" :class="{active:activeName==='account'}">账户登录</a>
                <a @click="activeName='qrcode'" href="javascript:;"  :class="{active:activeName==='qrcode'}" >扫码登录</a>
            </nav>

            <!-- 表单 -->
                <LoginForm v-if="activeName==='account'"></LoginForm>
            <!-- 二维码 -->
            <div v-if="activeName === 'qrcode'" class="qrcode-box">
                <img src="@/assets/images/qrcode.jpg" alt="">
                <p>打开 <a href="javascript:;">小象商场App</a> 扫码登录</p>
            </div>
        </div>
    </section>
    <!-- 底部组件 -->
    <LoginFooter />

</template>

<script>

import { ref } from 'vue'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import LoginForm from './components/login-form'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'LoginPage',
  components: {
    LoginHeader,
    LoginFooter,
    LoginForm
  },
  setup () {
    // 控制是 表单还是扫码
    const activeName = ref('account')

    // 存储登陆后回跳地址
    const store = useStore()
    const route = useRoute()
    store.commit('user/setRedirectUrl', route.query.redirectUrl || '/')

    return { activeName }
  }
}
</script>

<style scoped lang='less'>
.login-section {
    background: url(../../assets/images/login-bg.png) no-repeat left / contain;
    height: 488px;
    position: relative;

    .wrapper {
        width: 380px;
        background: #fff;
        min-height: 400px;
        position: absolute;
        left: 55%;
        top: 54px;
        transform: translate3d(100px, 0, 0);
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);

        nav {
            height: 55px;
            border-bottom: 1px solid #f5f5f5;
            display: flex;
            padding: 0 40px;
            text-align: right;
            align-items: center;

            a {
                flex: 1;
                line-height: 1;
                display: inline-block;
                font-size: 18px;
                position: relative;

                &:first-child {
                    border-right: 1px solid #f5f5f5;
                    text-align: left;
                }

                &.active {
                    color: @b2cColor;
                    font-weight: bold;
                }
            }
        }
    }
}
// 二维码容器
.qrcode-box {
  text-align: center;
  padding-top: 40px;
  p {
    margin-top: 20px;
    a {
      color: @b2cColor;
      font-size: 16px;
    }
  }
}
</style>
