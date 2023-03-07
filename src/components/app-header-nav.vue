<template>
    <ul class="app-header-nav">
    <li class="home">
        <RouterLink to="/" >首页</RouterLink>
    </li>

      <li v-for="item in list"
      :key="item.id"
      @mouseenter="show(item)"
      @mouseleave="hide(item)">
      <router-link :to="`/category/${item.id}`" @click="hide(item)">{{ item.name}}</router-link>
        <div class="layer" :class="{open:item.open}">
          <ul>
            <li v-for="sub in item.children" :key="sub.id" >
                <router-link :to="`/category/sub/${sub.id}`"  @click="hide(item)">
                <img :src="sub.picture" >
                <p>{{  sub.name}}</p>
            </router-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()
    // 拿到分类列表
    const list = computed(() => {
      return store.state.category.list
    })
    // 一级分类下的二级分类的显示
    const show = (item) => {
      store.commit('category/show', item.id)
    }
    // 二级分类下的二级分类的隐藏
    const hide = (item) => {
      store.commit('category/hide', item.id)
    }
    return { list, show, hide }
  }
}
</script>

  <style scoped lang='less'>
//   用的是本来layer高为0透明度1,鼠标经过layer就是height152，透明度0，layer加transtion
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @b2cColor;
        border-bottom: 1px solid @b2cColor;
      }
    //   显示二级类目
    //   > .layer {
    //         height: 132px;
    //          opacity: 1;
    //   }
    }
  }
}
.layer {
    // 当layer有open类名时候就显示二级目录
    &.open{
        height: 132px;
         opacity: 1;
    }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @b2cColor;
        }
      }
    }
  }
}
  </style>
