<template>
    <div class="b2c-dialog" v-show="visible" :class="{fade}">
      <div class="wrapper" :class="{fade}">
        <div class="header">
        <h3>{{title}}</h3>
        <a @click="close" href="JavaScript:;" class="iconfont icon-close-new"></a>
      </div>
        <div class="body">
          <!-- 对话框内容 -->
          <slot/>
        </div>
        <div class="footer">
          <!-- 插槽 -->
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </template>
<script>
// Vue3.0 v-model 语法糖 拆解===  ：modelValue+@update:modelValue
// Vue3.0 v-model:visible 语法糖 拆解===  ：visible+@update:visible
// Vue2.0  visible.sync语法糖 拆解===  ：visible+@update:visible
import { ref, watch } from 'vue'

export default {
  name: 'B2cDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const fade = ref(false)// 控制弹窗的显示和隐藏
    // visible值位true时候 显示弹窗，其实就是控制fade
    // 监听父亲传来的visible变化，然后给fade赋值
    watch(() => props.visible, () => { // newVal就是props.visible最新的值
      setTimeout(() => { // 延迟一下 动画效果才会生效因为加了过度
        fade.value = props.visible
      }, 0)
    }, { immediate: true })
    // 关闭对话框，通知父组件里的visible改变
    const close = () => {
      emit('update:visible', false)
    }
    return { fade, close }
  }
}
</script>
  <style scoped lang="less">
  .b2c-dialog {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 8887;
    background: rgba(0,0,0,0);
    &.fade {
      transition: all 0.4s;
      background: rgba(0,0,0,.5);
    }
    .wrapper {
      width: 600px;
      max-height: 600px;
      min-height: 200px;
      background: #fff;
      border-radius: 4px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-60%);
      opacity: 0;
      overflow: auto;
      &.fade {
        transition: all 0.4s;
        transform: translate(-50%,-50%);
        opacity: 1;
      }
      .body {
        padding: 20px 40px;
        font-size: 16px;
        .icon-warning {
          color: @priceColor;
          margin-right: 3px;
          font-size: 16px;
        }
      }
      .footer {
        text-align: center;
        padding: 10px 0 30px 0;
      }
      .header {
        position: relative;
        height: 70px;
        line-height: 70px;
        padding: 0 20px;
        border-bottom: 1px solid #f5f5f5;
        h3 {
          font-weight: normal;
          font-size: 18px;
        }
        a {
          position: absolute;
          right: 25px;
          top: 25px;
          font-size: 24px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #999;
          &:hover {
            color: #666;
          }
        }
      }
    }
  }
  </style>
