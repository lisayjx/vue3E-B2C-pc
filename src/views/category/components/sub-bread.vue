<template>
    <b2c-bread>
        <b2c-bread-item to="/">首页</b2c-bread-item>
        <b2c-bread-item :key="category.top.id" v-if="category.top" :to="`/category/${category.top.id}`">{{ category.top.name }}</b2c-bread-item>
        <Transition name="fade-right" mode="out-in">
            <b2c-bread-item :key="category.sub.id" v-if="category.sub">{{ category.sub.name}}</b2c-bread-item>
        </Transition>
    </b2c-bread>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'SubBread',
  setup () {
    // 通过计算属性从vuex中获取顶级类目和二级类目数据
    // 想得到的形式： 对象:{top:{id,name},sub{id,name}}
    // 需要先拿到当前的id，route.params.id
    const route = useRoute()
    const store = useStore()
    // 二级分类信息 category
    const category = computed(() => {
      const cate = {}
      // 先遍历一级类目，再从二级类目中找到当前点击的
      store.state.category.list.forEach((top) => {
        if (top.children) {
          // 如果一级类目有孩子，就把孩子中的id一样的作为当前二级类目
          const sub = top.children.find((sub) => sub.id === route.params.id)
          if (sub) {
            // 如果存在当前二级类目
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return { category }
  }
}
</script>

<style></style>
