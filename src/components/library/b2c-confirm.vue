<template>
    <div class="b2c-confirm" :class="{fade:fade}">
      <div class="wrapper" :class="{fade:fade}">
        <div class="header">
          <h3>{{ title }}</h3>
          <a @click="cancel" href="JavaScript:;" class="iconfont icon-close-new"></a>
        </div>
        <div class="body">
          <i class="iconfont icon-warning"></i>
          <span>{{ text}}</span>
        </div>
        <div class="footer">
          <B2cButton @click="cancel" size="mini" type="gray">取消</B2cButton>
          <B2cButton  @click="submit" size="mini" type="primary">确认</B2cButton>
        </div>
      </div>
    </div>
  </template>
<script>
//   动画：遮罩层淡入，弹框向下划入进场
import { ref, onMounted } from 'vue'
// 引入全局组件：因为我们的组件创建在app上，而刚才咱们自己创建的div（Confim.js）不在app上
// 所以此时index页面不能用app上面的全局组件，怎么办？我们自己引入一下就可以了
import B2cButton from './b2c-button.vue'
export default {
  name: 'B2cConfirm',
  components: { B2cButton },
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 内容
    text: {
      type: String,
      default: ''
    },
    // Confirm.js传来的
    cancelCallback: {
      type: Function
    },
    submitCallback: {
      type: Function
    }
  },
  setup (props) {
    // 弹窗显示与隐藏（带动画）
    const fade = ref(false)
    onMounted(() => { // 页面渲染完毕后 慢点过度
      // 过渡效果需要在元素创建完毕后延时一会加上才会触发
      setTimeout(() => {
        fade.value = true
      }, 0)
    })
    // 取消
    const cancel = () => {
    //   visible.value = false
      props.cancelCallback() // 走resolve
    }
    // 确认
    const submit = () => {
    //   visible.value = false
      props.submitCallback()// 走reject
    }
    return { fade, cancel, submit }
  }
}
</script>
  <style scoped lang="less">
  .b2c-confirm {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 8888;
    background: rgba(0,0,0,0);
    &.fade {//淡入
    transition: all 1s;
    background: rgba(0,0,0,.5);
  }
    .wrapper {
      width: 400px;
      background: #fff;
      border-radius: 4px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-60%);
      &.fade {//划入
      transition: all 1s;
      transform: translate(-50%,-50%);
      opacity: 1;
    }
      .header,.footer {
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
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
        text-align: right;
        .b2c-button {
          margin-left: 20px;
        }
      }
      .header {
        position: relative;
        h3 {
          font-weight: normal;
          font-size: 18px;
        }
        a {
          position: absolute;
          right: 15px;
          top: 15px;
          font-size: 20px;
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
