<template>
    <Form ref="target" class="b2c-form" :validation-schema="mySchema"  v-slot="{ errors }">
      <div class="user-info">
        <img :src="avatar" alt="" />
        <p>Hi，{{ nickname }} 欢迎来小象商场，完成绑定后可以QQ账号一键登录哦~</p>
      </div>
      <div  class="b2c-form-item">
        <div class="field">
          <i class="icon iconfont icon-phone"></i>
          <Field :class="{err:errors.mobile}" name="mobile" v-model="form.mobile" class="input" type="text" placeholder="绑定的手机号" />
        </div>
        <!-- 错误提示 -->
        <div v-if="errors.mobile" class="error">{{ errors.mobile}}</div>
      </div>
      <div  class="b2c-form-item">
        <div class="field">
          <i class="icon iconfont icon-code"></i>
          <Field :class="{err:errors.code}" name="code"  v-model="form.code" class="input" type="text" placeholder="短信验证码" />
          <span @click="send" class="code">
            {{time===0?'发送验证码':`${time}秒后发送`}}
          </span>
        </div>
         <!-- 错误提示 -->
         <div v-if="errors.code" class="error">{{ errors.code}}</div>
      </div>
      <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
    </Form>
  </template>

<script>
import QC from 'qc'
import { ref, reactive, onUnmounted } from 'vue'
// 表单校验,组件需要注册
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useIntervalFn } from '@vueuse/core'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }

  },
  setup (props) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    // qq登录：已注册，未绑定
    // 1. 准备下信息：unionId(openId) qq头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证吗（校验，定义api，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登录成功）

    // 1.准备下信息：unionId(openId) qq头像 昵称
    const nickname = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) { // 如果qq登录成功
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_1// 这个头像50大小
      })
    }
    // 2.表单验证
    const form = reactive({ // 表单数据对象
      mobile: null,
      code: null
    })
    const mySchema = { // 校验规则
      mobile: schema.mobile,
      code: schema.code
    }
    // 3.发送验证码
    // 3.1倒计时
    // pause 结束 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)

    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    // 销毁
    onUnmounted(() => {
      pause()
    })
    // 3.2点击发送验证码
    const target = ref(null) // 获取到表单dom
    const send = async () => {
      //  校验手机号 用13666666666试因为他注册了但是没绑定
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) { // 如果通过校验
      //  调用发送验证码的接口
        await userQQBindCode(form.mobile)
        Message({ type: 'success', text: '发送成功' })
        // 开始倒计时
        time.value = 60
        resume()
      } else { // 如果校验失败使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        target.value.setFieldError('mobile,valid')
      }
    }
    // 4.立即绑定  13666666666点击获取验证码，然后123456，直接到首页
    const submit = async () => {
      // 整体表单校验
      const valid = await target.value.validate()// 等校验通过做操作
      if (valid === true) { // 如果通过校验
        // 绑定登录接口
        userQQBindLogin({
          unionId: props.unionId,
          ...form
        }).then(res => {
          console.log(res)
          const { id, account, nickname, avatar, token, mobile } = res.result
          // 1.存储信息
          store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
          // // 2.提示
          Message({ type: 'success', text: 'qq绑定成功' })
          // // 3.跳转
          router.push(route.query.redirectUrl || '/')
        }).catch(err => {
          Message({ type: 'error', text: err.response.data.message || '绑定失败' })
        })
      }
    }

    return { nickname, avatar, form, mySchema, send, time, target, submit }
  }
}
</script>

  <style scoped lang='less'>
  .user-info {
      width: 320px;
      height: 70px;
      margin: 0 auto;
      display: flex;
      background: #f2f2f2;
      align-items: center;
      padding: 0 10px;
      margin-bottom: 25px;
      img {
        background: #f2f2f2;
        width: 50px;
        height: 50px;
      }
      p {
        padding-left: 10px;
      }
    }
    .code {
      position: absolute;
      right: 0;
      top: 0;
      line-height: 50px;
      width: 80px;
      color: #999;
      &:hover {
        cursor: pointer;
      }
    }
  </style>
