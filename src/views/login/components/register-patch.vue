<template>
    <Form ref="target" :validation-schema="mySchema" v-slot="{errors}" class="b2c-form" autocomplete="off">
      <div class="b2c-form-item">
        <div class="field">
          <i class="icon iconfont icon-user"></i>
          <Field :class="{err:errors.account}" v-model="form.account" name="account" class="input" type="text" placeholder="请输入用户名" />
        </div>
        <div v-if="errors.account" class="error">{{errors.account}}</div>
      </div>
      <div class="b2c-form-item">
        <div class="field">
          <i class="icon iconfont icon-phone"></i>
          <Field :class="{err:errors.mobile}" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="请输入手机号" />
        </div>
        <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
      </div>
      <div class="b2c-form-item">
        <div class="field">
          <i class="icon iconfont icon-code"></i>
          <Field :class="{err:errors.code}" v-model="form.code" name="code" class="input" type="text" placeholder="请输入验证码" />
          <span @click="send()" class="code">
            {{time===0?'发送验证码':`${time}秒后发送`}}
          </span>
        </div>
        <div v-if="errors.code" class="error">{{errors.code}}</div>
      </div>
      <div class="b2c-form-item">
        <div class="field">
          <i class="icon iconfont icon-lock"></i>
          <Field :class="{err:errors.password}" v-model="form.password" name="password" class="input" type="password" placeholder="请输入密码" />
        </div>
        <div v-if="errors.password" class="error">{{errors.password}}</div>
      </div>
      <div class="b2c-form-item">
        <div class="field">
          <i class="icon iconfont icon-lock"></i>
          <Field :class="{err:errors.rePassword}" v-model="form.rePassword" name="rePassword" class="input" type="password" placeholder="请确认密码" />
        </div>
        <div v-if="errors.rePassword" class="error">{{errors.rePassword}}</div>
      </div>
      <a @click="submit()" href="javascript:;" class="submit">立即提交</a>
    </Form>
  </template>

<script>
// 既没注册也没绑定过
import { Form, Field } from 'vee-validate'
import { reactive, ref, onUnmounted } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { getRegisterCodePc, register } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'RegisterPage',
  components: { Form, Field },
  setup () {
    // 1. 表单校验 多两个校验：用户名是否存在，再次输入密码是否一致
    // 2. 发送短信验证码：接口API定义（新的，注册的那个接口）
    // 3. 完善信息
    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null
    })
    // 表单校验规则
    const mySchema = {
      account: schema.accountApi, // 已经包括了校验用户名是否存在
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password
    }
    // -------------------------------------------------------
    // 倒计时
    const target = ref(null)// 获取表单dom元素
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })

    // 1. 发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号，如果成功才去发送短信（定义API），请求成功开启60s的倒计时，不能再次点击，倒计时结束恢复
    // 1.3 如果失败，失败的校验样式显示出来
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才可以发送
          await getRegisterCodePc(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        target.value.setFieldError('mobile', valid)
      }
    }

    // ------------------------立即提交----------------------------------
    // 完善信息
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = target.value.validate()
      if (valid) {
        register({ ...form }).then(data => {
          // 实现和之前登录一样的逻辑
        //   1. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 合并购物车操作
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 2. 提示
            Message({ type: 'success', text: '注册成功' })
            // 3. 跳转到首页
            router.push('/')
          })
        }).catch(e => {
          Message({ type: 'error', text: '注册失败' })
        })
      }
    }

    return { form, mySchema, target, time, send, submit }
  }
}
</script>

    <style scoped lang='less'>
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
