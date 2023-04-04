<template>
    <div class="b2c-city" ref="target">
      <div class="select" @click="toggleDialog" :class="{active:visible}">
        <!-- 如果有值,显示在这里 -->
        <span v-if="fullLocation" class="value">{{ fullLocation}}</span>
         <!--如果没有值 就占位  -->
        <span v-else class="placeholder">{{ placeholder}}</span>
        <i class="iconfont icon-angle-down"></i>
      </div>
      <div class="option" v-show="visible">
        <div v-if="loading" class="loading"></div>
       <template v-else>
        <span @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">{{ item.name}}</span>
       </template>
      </div>
    </div>
  </template>
<script>
import { computed, ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'B2cCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    // 控制展开收起,默认收起
    const visible = ref(false)// 显示隐藏数据
    const cityData = ref([]) // 城市数据
    const loading = ref(false) // 正在加载中
    const openDialog = () => {
      visible.value = true
      // 打开弹窗时候才获取城市数据
      loading.value = true
      getCityData().then(res => {
        cityData.value = res
        loading.value = false
      })
      //   清空选择结果
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const closeDialog = () => {
      visible.value = false
    }
    // 切换展开收起,提供一个切换函数给select使用
    const toggleDialog = () => {
      visible.value ? closeDialog() : openDialog()
    }
    // 点击其他位置隐藏,onClickOutside监听到你点的元素的外部
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })
    // 计算属性:根据点击的省份城市获取对应的列表,获取当前要现实的地区列表(省/市/区)
    const currList = computed(() => {
      // 如果是省
      let currList = cityData.value
      //   如果是城市
      if (changeResult.provinceCode) {
        currList = currList.find(p => p.code === changeResult.provinceCode).areaList
      }
      //   如果是地区
      if (changeResult.cityCode) {
        currList = currList.find(c => c.code === changeResult.cityCode).areaList
      }
      return currList
    })
    // 第二步：监听用户点击 省，市 展示 市列表和地区列表。
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    const changeItem = (item) => {
      // item可能是 省/市/区
    //  省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      //   地区
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        closeDialog()
        //   把省市区交给父亲
        emit('change', changeResult)
      }
    }
    return { visible, toggleDialog, target, cityData, loading, currList, changeItem }
  }
}
// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  // 这个位置可能有异步或者同步操作，所以封装成promise,数据需要.then获取
//   同步:直接从缓存取数据,异步:第一次通过axios从服务器取数据
  return new Promise((resolve, reject) => {
    // 约定好数据存储在 window上的cityData字段
    // 1.如果有缓存
    if (window.cityData) {
      resolve(window.cityData)
    } else { // 2.如果没有缓存 去服务器取,然后存入缓存为了下次直接取
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data// 存入缓存
        resolve(res.data)// 把数据送出去
      })
    }
  })
}
</script>
<style scoped lang="less">
.b2c-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
