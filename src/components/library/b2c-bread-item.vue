<template>
    <div class="b2c-bread-item">
        <!-- 如果能跳转地址 -->
        <RouterLink v-if="to" :to="to">
            <!-- 插槽 -->
            <slot />
        </RouterLink>
        <!-- 如果不能跳转地址 -->
        <span v-else>
            <!-- 插槽 -->
            <slot />
        </span>
       <!-- 箭头 -->
        <i class="iconfont icon-angle-right"></i>
    </div>
</template>
<script>
export default {
  name: 'B2cBreadItem',
  props: {
    to: {
      type: [String, Object]
    }
  }
}
</script>
