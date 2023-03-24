<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- 表单校验,Field的name为了校验 -->
    <!-- autocomplete="off"原生表单的,是否开启填充,比如用户名下面一堆提示 -->
    <Form ref="target" class="form" :validation-schema="mySchema" v-slot="{ errors }" autocomplete="off">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model="form.account" type="text" placeholder="请输入用户名" name="account"
              :class="{ error: errors.account }" />
          </div>
          <!-- 错误提示 -->
          <div v-if="errors.account" class="error">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field v-model="form.password" type="password" placeholder="请输入密码" name="password" />
          </div>
          <!-- 错误提示 -->
          <div v-if="errors.password" class="error">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model="form.mobile" type="text" placeholder="请输入手机号" name="mobile" />
          </div>
          <!-- 错误提示 -->
          <div v-if="errors.mobile" class="error">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field v-model="form.code" type="password" placeholder="请输入验证码" name="code" />
            <span @click="send()" class="code">
              {{ time === 0 ? "发送验证码" : `${time}秒后发送` }}
            </span>
          </div>
          <!-- 错误提示 -->
          <div v-if="errors.code" class="error">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="b2c-checkbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <!-- 错误提示 -->
        <div v-if="errors.isAgree" class="error">
          <i class="iconfont icon-warning" />{{ errors.isAgree }}
        </div>
      </div>

      <a @click="login()" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <!-- qq登录按钮 -->
      <!-- <span id="qqLoginBtn"></span> -->
      <!-- <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="" /> -->
      <!-- 这个地址 注意项目启动的端口号 -->

      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="" />
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
// 表单校验,组件需要注册
import { Form, Field } from 'vee-validate'
// 引入校验函数
import schema from '@/utils/vee-validate-schema'
// 引入消息提示函数
import Message from '@/components/library/Message'
import {
  userAccountLogin,
  userMobileLoginMsg,
  userMobileLogin
} from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core' // 定时器
// import QC from 'qc' // 导入qq提供的全局方法
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup () {
    // 是否短信登录
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: false,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // 校验步骤
    // 1.下载插件 npm i vee-validate@4.0.3
    // 2.导入组件 import { Form  , Field } from 'vee-validate',注册组件
    // 3.Form代替表单,Field代替input
    // 4.Field里 加name=校验规则,
    // 5.Field双向数据绑定v-model,字段名最好和接口文档一致 因为要发给后台
    // 6.定义Field里的name属性的校验规则函数,Form的validation-schema接收校验规则是对象
    // 7.Form里写v-slot="{errors}"
    // 8.Field中 显示的错误提示  v-if="errors.account"
    // 9.需要重置数据得数据和校验规则，获取元素，然后resetField()
    // 10.啥都没输入时候，点击登录做整体表单校验
    // Field默认解析成input,如果field想是组件得话 就加 as='组件名'
    const mySchema = {
      // 校验函数规则:返回true就是校验成功，返回一个字符串就是失败，字符串就是错误提示
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }
    // 切换表单元素，还原数据和清除校验效果
    const target = ref(null) // 获取元素
    watch(isMsgLogin, () => {
      // 重置数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 校验效果清除，Form组件提供resetForm()
      target.value.resetForm()
    })
    // 点击登录
    // const { proxy } = getCurrentInstance() // 获取当前组件实例proxy，proxy是从应用实例app上解构出来的
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const login = async () => {
      // 对表单整体校验，validate函数
      // Form组件提供了一个 validate_函数作为整体表单校验，当是返回的是一个promise1

      const valid = await target.value.validate() // 等校验通过做操作
      // 可以进行登录请求
      //   vue3.0组合式api用 引入Message（{}）
      //   不用选项式api怎么调原型上的方法？setup中怎么调用原型上的方法？
      //   proxy.$message({ type: 'error', text: 'error!!!!!!!!!!!!!!!!!!!!!' })
      if (valid) {
        try {
          let res = null // 装得到的结果
          // 账号密码登录 zhousg 123456
          if (!isMsgLogin.value) {
            const { account, password } = form
            res = await userAccountLogin({ account, password })
          } else {
            // 手机号登陆
            // 1.发送验证码
            // 1.1绑定发送验证码按钮点击事件
            // 1.2校验手机号，如果成功发送短信（api），开始60s倒计时，不能再次点击，倒计时结束回复原样
            //   1.3手机号校验失败，显示校验结果
            // 2.手机号登陆（api，存储信息，提示成功，跳转页）
            const { mobile, code } = form
            res = await userMobileLogin({ mobile, code })
          }
          const { id, account, nickname, avatar, token, mobile } = res.result
          // 1.存储信息
          store.commit('user/setUser', {
            id,
            account,
            nickname,
            avatar,
            token,
            mobile
          })
          // // 2.提示
          Message({ type: 'success', text: '登录成功' })
          // // 3.跳转
          router.push(route.query.redirectUrl || '/')
        } catch (error) {
          if (error) {
            Message({
              type: 'error',
              text: error.response.data.message || '登陆失败'
            })
          }
        }
      }
    }
    // 点击发送验证码
    // 1.发送验证码
    // 1.1绑定发送验证码按钮点击事件
    // 1.2校验手机号，如果成功发送短信（api），开始60s倒计时，不能再次点击，倒计时结束回复原样
    //   1.3手机号校验失败，显示校验结果

    // pause暂停 resume开始
    // useIntervalFn（回调函数，执行间隔，是否立即开启）
    const time = ref(0)
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      false
    )
    const send = async () => {
      // 校验手机号  13666666666
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 校验成功并且没有在倒计时
        if (time.value === 0) {
          // 请求验证码接口
          await userMobileLoginMsg(form.mobile).then((res) => {
            console.log(res.result)
          })
          Message({ type: 'success', text: '验证码发送成功' })
          // 定时器开启
          time.value = 60
          resume()
        }
      } else {
        // 校验失败，使用vee的错误函数显示信息setFieldError(字段名，错误信息)设置字段错误
        target.value.setFieldError('mobile', valid)
      }
    }
    // 初始化qq登录按钮（看官方）得到跳转地址而已
    // 她会弹出新的窗口，我们审查元素找到这个地址，让她不弹出来，我们自己写元素
    // onMounted(() => {//然后去审查 那个qq登录的元素 找到地址就成功
    //   // 组件渲染完毕，使用QC生成QQ登录按钮
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })

    return {
      isMsgLogin,
      form,
      mySchema,
      target,
      login,
      send,
      time
    }
  }

  //  vue2.0 选项式api用 原型上的this.$message
  //   created () {
  //     this.$message({ type: 'error', text: 'error!!!!!' })
  //   }
}
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: @b2cColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 40px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;
        border-radius: 10px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
          border-radius: 4px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          border-radius: 4px;

          &.error {
            border-color: @priceColor;
          }

          &.active,
          &:focus {
            border-color: @b2cColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @b2cColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
