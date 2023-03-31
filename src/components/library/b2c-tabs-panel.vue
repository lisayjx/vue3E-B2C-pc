<template>
  <!-- 每个选项卡对应的内容 放在这里 -->
  <div class="b2c-tabs=panel" v-show="name===activeName">
    <slot/>
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'B2cTabsPanel',
  props: {
    label: { // 选项卡文字
      type: String,
      default: ''
    },
    name: { // 选项卡 唯一标识
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    // 从祖先 b2c-tabs页 拿到的
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>

<style>

</style>
