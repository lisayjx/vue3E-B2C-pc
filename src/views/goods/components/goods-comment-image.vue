<template>
    <div class="goods-comment-image">
      <div class="list" v-if="pictures">
        <a
          href="javascript:;"
          v-for="url in pictures"
          :key="url"
          :class="{active:currImage===url}"
          @click="currImage=url"
        >
          <img :src="url" alt="">
        </a>
      </div>
      <!-- 预览图片 -->
      <div v-if="currImage" class="preview">
        <img :src="currImage" alt="">
        <i @click="currImage=null" class="iconfont icon-close-new"></i>
    </div>
    </div>
  </template>
<script>
import { ref } from 'vue'
export default {
  name: 'GoodsCommentImage',
  props: {
    pictures: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const currImage = ref(null)
    return { currImage }
  }
}
</script>
  <style scoped lang="less">
  .goods-comment-image {
    .list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      a {
        width: 120px;
        height: 120px;
        border:1px solid #e4e4e4;
        margin-right: 20px;
        margin-bottom: 10px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;//contain：图片将被缩放适应容器，保留宽高比，可能会留白。
        }
        &.active {
          border-color: @b2cColor;
        }
      }
    }
  }
  .preview {
    width: 480px;
    height: 480px;
    border: 1px solid #e4e4e4;
    background: #f8f8f8;
    margin-bottom: 20px;
    position: relative;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    i {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background: rgba(0,0,0,0.2);
      color: #fff;
      text-align: center;
      line-height: 30px;
    }
  }
  </style>
