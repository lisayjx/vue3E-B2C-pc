<template>
    <button class="b2c-button ellipsis" :class="[size,type]">
      <slot />
    </button>
  </template>
<script>
export default {
  name: 'B2cButton',
  props: {
    size: {
      type: String,
      default: 'middle'
    },
    type: {
      type: String,
      default: 'default'
    }
  }
}
</script>
  <style scoped lang="less">
  .b2c-button {
    appearance: none;
    border: none;
    outline: none;
    background: #fff;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
  }
  .large {
    width: 240px;
    height: 50px;
    font-size: 16px;
  }
  .middle {
    width: 180px;
    height: 50px;
    font-size: 16px;
  }
  .small {
    width: 100px;
    height: 32px;
    font-size: 14px;
  }
  .mini {
    width: 60px;
    height: 32px;
    font-size: 14px;
  }
  .default {
    border-color: #e4e4e4;
    color: #666;
  }
  .primary {
    border-color: @b2cColor;
    background: @b2cColor;
    color: #fff;
  }
  .plain {
    border-color: @b2cColor;
    color: @b2cColor;
    background: lighten(@b2cColor,50%);
  }
  .gray {
    border-color: #ccc;
    background: #ccc;;
    color: #fff;
  }
  </style>
