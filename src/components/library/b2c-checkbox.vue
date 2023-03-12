<template>
    <!-- 复选框组件 -->
    <div class="b2c-checkbox" @click="changeChecked()">
        <!-- 要么选中要么不选中 -->
      <i v-if="checked" class="iconfont icon-checked"></i>
      <i v-else class="iconfont icon-unchecked"></i>
       <!-- 文字 -->
      <span v-if="$slots.default">
        <slot />
    </span>
    </div>
  </template>
<script>
// v-model  ====>  :modelValue  +   @update:modelValue
// import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'B2cCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 1.原生方法实现数据双向绑定v-model
    /*
    const checked = ref(false)// 选中还是没选中的状态
    const changeChecked = () => {
      checked.value = !checked.value
      // 使用emit通知父组件数据的改变
      emit('update:modelValue', checked.value)
    }
    // 使用侦听器，得到父组件传递数据，给checked数据
    watch(() => props.modelValue, () => {
      checked.value = props.modelValue
    }, { immediate: true })
    */
    // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      //  通知父组件
      checked.value = newVal// 满足双向数据绑定的
      emit('change', newVal) // 满足change事件的
    }
    return { checked, changeChecked }
  }
}
</script>
  <style scoped lang="less">
  .b2c-checkbox {
    display: inline-block;
    margin-right: 2px;
    .icon-checked {
      color: @b2cColor;
      ~ span {
        color: @b2cColor;
      }
    }
    i {
      position: relative;
      top: 1px;
    }
    span {
      margin-left: 2px;
    }
  }
  </style>
