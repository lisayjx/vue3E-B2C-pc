<template>
    <div class='b2c-bread'>
     <!-- 插槽 -->
     <slot></slot>
    </div>
  </template>

<script>
export default {
  name: 'B2cBread',
  props: {

  }
}
</script>

  <style  lang='less'>
//   取出scoped，让他作用域b2c-bread-item上
  .b2c-bread{
    display: flex;
    padding: 25px 10px;
    &-item {
      a {
        color: #666;
        transition: all .4s;
        &:hover {
          color: @b2cColor;
        }
      }
    }
    i {
      font-size: 12px;
      margin-left: 5px;
      margin-right: 5px;
      line-height: 22px;
    }
  }
  </style>
