<template>
    <div class="b2c-numbox">
      <div class="label" v-if="label">{{ label}}</div>
      <div class="numbox">
        <a @click="changeNum(-1)" href="javascript:;">-</a>
        <input type="text" readonly :value="modelValue">
        <a @click="changeNum(+1)" href="javascript:;">+</a>
      </div>
    </div>
  </template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'B2cNumbox',
  props: {
    label: {
      type: String
    },
    modelValue: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    }
  },
  setup (props, { emit }) {
    // 双向绑定
    const num = useVModel(props, 'modelValue', emit)
    // 改变数量
    const changeNum = (step) => {
      // 1．绑定按钮点击事件-按钮+按钮触发同一个事件，同一个函数
      // 2．使用vueuse的useVModel做数据绑定,修改count通知父组件更新
      const newVal = num.value + step
      //   3.得到将要改变的值,如果值不合法就终止程序
      if (newVal < props.min || newVal > props.max) return
      //   4.正常改值即可
      num.value = newVal
      //   5.通常这种选择类型的组件 要暴露给使用者一个事件
      emit('change', newVal)
    }
    return { num, changeNum }
  }
}
</script>
  <style scoped lang="less">
  .b2c-numbox {
    display: flex;
    align-items: center;
    .label {
      width: 60px;
      color: #999;
      padding-left: 10px;
    }
    .numbox {
      width: 120px;
      height: 30px;
      border: 1px solid #e4e4e4;
      display: flex;
      > a {
        width: 29px;
        line-height: 28px;
        text-align: center;
        background: #f8f8f8;
        font-size: 16px;
        color: #666;
        &:first-of-type {
          border-right:1px solid #e4e4e4;
        }
        &:last-of-type {
          border-left:1px solid #e4e4e4;
        }
      }
      > input {
        width: 60px;
        padding: 0 5px;
        text-align: center;
        color: #666;
      }
    }
  }
  </style>
