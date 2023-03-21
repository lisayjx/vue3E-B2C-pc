<template>
    <!-- 有条数才显示分页 -->
    <div class="b2c-pagination" >
        <!-- 分开写因为 禁用的不能加事件,正常的需要有事件 -->
    <a v-if="myCurrentPage<=1" href="javascript:;" class="disabled">上一页</a>
    <a v-else href="javascript:;" @click="changePage(myCurrentPage-1)">上一页</a>

    <span v-if="pager.start>1">...</span>
     <!-- 页码数组 -->
      <a v-for="i in pager.btnArr" :key="i" href="javascript:;" @click="changePage(i)" :class="{active:myCurrentPage===i}">{{ i }}</a>

      <span v-if="pager.end<pager.totalPage">...</span>

      <a v-if="myCurrentPage>=pager.totalPage" href="javascript:;" class="disabled">下一页</a>
    <a v-else href="javascript:;" @click="changePage(myCurrentPage+1)" >下一页</a>
    </div>
  </template>
<script>
import { ref, computed, watch } from 'vue'
/*
(上一页按钮)是否禁用:需要知道当前页码是否是1,是否显示:需要知道第一个按钮页码是否是1
1.需要知道显示几个按钮
⒉需要知道起始按钮页码，结束按钮页码，得到数组如[3,4,5,6,7]方可渲染
3.需要知道当前页码才可激活对应按钮
(下一页按钮)是否显示:需要知道最后一个按钮页码是否等于总页数,是否禁用:需要知道:当前页码是否等于总页数

结论:需要(按钮个数，当前页码，总页数，起始页码，结束页码，按钮数组)才可以完成渲染。
*/
export default {
  name: 'B2cPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 准备数据
    // 评论总条数
    const myCommentTotal = ref(100)
    // 每页条数
    const myPageSize = ref(10)
    // 当前第几页
    const myCurrentPage = ref(3)
    // 按钮个数
    const btnCount = 5

    // 重点：根据上述数据得到（总页数，起始页码，结束页码，按钮数组）
    const pager = computed(() => {
      // 1.总页数
      const totalPage = Math.ceil(myCommentTotal.value / myPageSize.value)
      // 2.起始页码和结束页码
      // 2.1. 理想情况根据当前页码，和按钮个数可得到
      let start = myCurrentPage.value - Math.floor(btnCount / 2)
      let end = start + btnCount - 1
      // 2.2. 不理想情况下
      // 如果起始页码小于1了，需要重新计算
      if (start < 1) {
        start = 1
        end = (start + btnCount - 1) > totalPage ? totalPage : (start + btnCount - 1)
      }
      // 如果结束页码大于总页数，需要重新计算
      if (end > totalPage) {
        end = totalPage
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }
      // 处理完毕start和end得到按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { totalPage, start, end, btnArr }
    })
    // 点击上一页/下一页/页码,改变页码
    const changePage = (newPage) => {
      if (myCurrentPage.value !== newPage) {
        myCurrentPage.value = newPage
        // 通知父组件最新页码
        emit('CurrentChange', newPage)
      }
    }
    // 监听传入的值改变
    watch(props, () => {
      myCommentTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    }, { immediate: true })

    return { myCurrentPage, pager, changePage }
  }
}
</script>
  <style scoped lang="less">
  .b2c-pagination {
    display: flex;
    justify-content: center;
    padding: 30px;
    > a {
      display: inline-block;
      padding: 5px 10px;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
      margin-right: 10px;
      &:hover {
        color: @b2cColor;
      }
      &.active {
        background: @b2cColor;
        color: #fff;
        border-color: @b2cColor;
      }
      &.disabled {
        cursor: not-allowed;
        opacity: 0.4;
        &:hover {
          color: #333
        }
      }
    }
    > span {
      margin-right: 10px;
    }
  }
  </style>
