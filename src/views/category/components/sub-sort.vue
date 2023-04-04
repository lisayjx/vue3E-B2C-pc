<template>
    <div class='sub-sort'>
      <div class="sort">
        <a :class="{active:sortParams.sortField===null}" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a :class="{active:sortParams.sortField==='publishTime'}" @click="changeSort('publishTime')" href="javascript:;">最新商品</a>
      <a :class="{active:sortParams.sortField==='orderNum'}" @click="changeSort('orderNum')" href="javascript:;">最高人气</a>
      <a :class="{active:sortParams.sortField==='evaluateNum'}" @click="changeSort('evaluateNum')" href="javascript:;">评论最多</a>
        <a @click="changeSort('price')"  href="javascript:;">
          价格排序
          <i class="arrow up" :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod=='asc'}" />
        <i class="arrow down" :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod=='desc'}" />
        </a>
      </div>
      <div class="check">
        <b2c-checkbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</b2c-checkbox>
        <b2c-checkbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</b2c-checkbox>
      </div>
    </div>
  </template>
<script>
import { reactive } from 'vue'

export default {
  name: 'SubSort',
  setup (props, { emit }) {
    // 实现交互（和后台一致）
  //  1.明确交互数据
    const sortParams = reactive({
      inventory: false, // 是否有库存
      onlyDiscount: false, // 只显示特惠
      sortField: null, // 排序字段
      sortMethod: null // 排序规则 asc,desc
    })
    // 2.提供模板使用
    // 3.需要绑定按钮的点击事件,修改排序字段和排序方式
    const changeSort = (sortField) => {
      if (sortField === 'price') { // 价格排序(特殊)
        sortParams.sortField = sortField
        // 处理排序
        // 从来没选择过价格的情况（ sortMethod: null） 默认时候从高到低排序
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else { // 点击过了
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else { // 其他普通按钮
        if (sortParams.sortField === sortField) return// 如果已经选中，下面不必执行
        sortParams.sortField = sortField
        sortParams.sortMethod = null // 默认排序
      }
      // 通知父亲  触发sort-change事件,把排序数据给父亲
      emit('sort-change', sortParams)
    }

    // 点击复选框
    const changeCheck = () => {
      // 通知父亲  触发sort-change事件,把排序数据给父亲
      emit('sort-change', sortParams)
    }
    return { sortParams, changeSort, changeCheck }
  }
}
</script>
  <style scoped lang='less'>
  .sub-sort {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .sort {
      display: flex;
      a {
        height: 30px;
        line-height: 28px;
        border: 1px solid #e4e4e4;
        padding: 0 20px;
        margin-right: 20px;
        color: #999;
        border-radius: 2px;
        position: relative;
        transition: all .3s;
        &.active {
          background: @b2cColor;
          border-color: @b2cColor;
          color: #fff;
        }
        .arrow {
          position: absolute;
          border: 5px solid transparent;
          right: 8px;
          &.up {
            top: 3px;
            border-bottom-color: #bbb;
              &.active {
              border-bottom-color: @b2cColor;
            }
          }
          &.down {
            top: 15px;
            border-top-color: #bbb;
            &.active {
              border-top-color: @b2cColor;
            }
          }
        }
      }
    }
    .check {
      .b2c-checkbox {
        margin-left: 20px;
        color: #999;
      }
    }
  }
  </style>
