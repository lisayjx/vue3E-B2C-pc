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
                    <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />{{ errors.account }}</div>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-lock"></i>
                        <Field v-model="form.password" type="password" placeholder="请输入密码" name="password" />
                    </div>
                    <!-- 错误提示 -->
                    <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />{{ errors.password }}</div>
                </div>
            </template>
            <template v-else>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field v-model="form.mobile" type="text" placeholder="请输入手机号" name="mobile" />
                    </div>
                     <!-- 错误提示 -->
                     <div v-if="errors.mobile" class="error"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-code"></i>
                        <Field v-model="form.code" type="password" placeholder="请输入验证码" name="code" />
                        <span class="code">发送验证码</span>
                    </div>
                       <!-- 错误提示 -->
                       <div v-if="errors.code" class="error"><i class="iconfont icon-warning" />{{ errors.code }}</div>
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
              <div v-if="errors.isAgree" class="error"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
            </div>

            <a @click="login()" href="javascript:;" class="btn">登录</a>
        </Form>
        <div class="action">
            <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="" />
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
    const login = async () => {
      // 对表单整体校验，validate函数
      // Form组件提供了一个 validate_函数作为整体表单校验，当是返回的是一个promise1

      const valid = await target.value.validate()// 等校验通过做操作
      console.log(valid)
      // 可以进行登录请求
      //   vue3.0组合式api用 引入Message（{}）
      Message({ type: 'error', text: 'error' })
      //   不用选项式api怎么调原型上的方法？setup中怎么调用原型上的方法？
    //   proxy.$message({ type: 'error', text: 'error!!!!!!!!!!!!!!!!!!!!!' })
    }

    return {
      isMsgLogin, form, mySchema, target, login

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
