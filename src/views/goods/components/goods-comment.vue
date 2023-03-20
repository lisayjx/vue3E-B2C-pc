<template>
  <div class="goods-comment">
    <!-- 评价头部 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>100</span><span>人购买</span></p>
        <p><span>99.99%</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a v-for="(item,index) in commentInfo.tags"
          :key="item.title" href="javascript:;"
          @click="changeTag(item,index)"
          :class="{active:currentTagIndex===index}">{{ item.title }}（{{ item.tagCount }}）</a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a @click="changeSort(null)" href="javascript:;" :class="{active:reqParams.sortField===null}">默认</a>
      <a  @click="changeSort('praiseCount')"  href="javascript:;" :class="{active:reqParams.sortField==='praiseCount'}">最新</a>
      <a  @click="changeSort('createTime')"    href="javascript:;" :class="{active:reqParams.sortField==='createTime'}">最热</a>
    </div>
    <!-- 评价列表 -->
    <!-- 列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <!-- 实心的 -->
            <!-- <i v-for="(i,index) in item.score" :key="index" class="iconfont icon-wjx01"></i> -->
            <i v-for="i in item.score" :key="i+'s'" class="iconfont icon-wjx01"></i>
           <!-- 空心 -->
            <!-- <i v-if="item.score<5" class="iconfont icon-wjx02"></i> -->
            <i v-for="i in 5-item.score" :key="i+'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">{{ item.content}}</div>
          <div class="time">
            <span>{{ item.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{ item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, inject, reactive, watch } from 'vue'
import { findCommentInfoByGoods, findCommentList } from '@/api/product'

export default {
  name: 'GoodsComment',
  setup () {
    // 评价信息
    const goods = inject('goods')
    const commentInfo = ref(null)
    findCommentInfoByGoods(goods.value.id).then(res => {
      // 设置数据前,tags数组前要追加 有图tag,全部评价tag
      res.result.tags.unshift({ title: '有图', tagCount: res.result.hasPictureCount, type: 'img' })
      res.result.tags.unshift({ title: '全部评价', tagCount: res.result.evaluateCount, type: 'all' })
      commentInfo.value = res.result
      console.log(res.result)
    })

    // 当前点击的tag,激活tag
    const currentTagIndex = ref(0)
    // 切换tag
    const changeTag = (item, index) => {
      currentTagIndex.value = index
      // 点击tag更新筛选条件:3种情况
      // 1.点击全部评价
      // 2.点击有图
      // 3.正常tag
      if (item.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (item.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = item.title
      }

      // console.log(reqParams)
    }
    // 点击排序
    const changeSort = (sortField) => {
      reqParams.sortField = sortField
      reqParams.page = 1// 页码重置到1
    }

    // 筛选条件准备
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null// 排序方式:praiseCount热度,createTime最新
    })
    //  监听筛选条件,只要变化就重新发起请求
    const commentList = ref([])// 评论列表数据
    watch(reqParams, () => {
      // 发请求
      findCommentList(goods.id, reqParams).then(res => {
        commentList.value = res.result.items
        console.log(res.result.items)
      })
    }, { immediate: true, deep: true })
    // 定义转换规格信息的函数
    const formatSpecs = (specs) => {
      console.log(specs)
      return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
    }

    // 定义转换用户名的函数
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }
    return { commentInfo, currentTagIndex, changeTag, reqParams, commentList, changeSort, formatSpecs, formatNickname }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @b2cColor;
            background: lighten(@b2cColor,50%);
            color: @b2cColor;
          }
          &.active {
            border-color: @b2cColor;
            background: @b2cColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @b2cColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
