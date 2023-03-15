<template>
    <!-- 筛选区 -->
    <div class="sub-filter" v-if="subFilterData && filterLoad === false">
        <!-- 品牌行 -->
        <div class="item">
            <div class="head">品牌：</div>
            <div class="body">
                <a :class="{ active: brand.id === subFilterData.selectedBrandId }"
                    @click="changeBrand(brand.id)" href="javascript:;"
                    v-for="brand in subFilterData.brands" :key="brand.id">{{ brand.name }}</a>
            </div>
        </div>
        <!-- 其他行 -->
        <div class="item" v-for="ProType in subFilterData.saleProperties" :key="ProType.id">
            <div class="head">{{ ProType.name }}:</div>
            <div class="body">
                <a :class="{ active: subItem.id === ProType.selectedProId }" @click="changePro(ProType,subItem)"
                    href="javascript:;" v-for="subItem in ProType.properties" :key="subItem.id">{{ subItem.name }}</a>
            </div>
        </div>
    </div>
    <!-- 骨架屏 -->
    <div v-else class="sub-filter">
        <b2c-skeleton class="item" width="800px" height="40px" />
        <b2c-skeleton class="item" width="800px" height="40px" />
        <b2c-skeleton class="item" width="600px" height="40px" />
        <b2c-skeleton class="item" width="600px" height="40px" />
        <b2c-skeleton class="item" width="600px" height="40px" />
    </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSubCategoryFilter } from '@/api/category'

export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    // 拿到二级分类筛选条件的数据
    const route = useRoute()
    const filterLoad = ref(false) // 默认加载完毕状态,filterLoad每次都能监听到数据加载的情况
    const subFilterData = ref([])
    //   监听二级分类的id变化，获取筛选数据
    watch(() => route.params.id, (newVal) => {
      // 如果变化有新的id，并且是在二级类目路由下  才获取请求数据
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoad.value = true // 加载数据
        // 获取数据
        getSubCategoryFilter(route.params.id).then(res => {
          // 每一组可选的筛选条件缺失全部条件,需要处理数据，加上全部
          //   需要给每组数据加一个属性就是 当前选中的id,为了以后做选中哪个那个就加active
          // 1.品牌
          res.result.selectedBrandId = null// 当前选中的品牌id，正好和全部的id一样，所以默认选中全部
          res.result.brands.unshift({ id: null, name: '全部' })
          // 2.属性
          res.result.saleProperties.forEach(item => {
            item.selectedProId = null// 当前选中的所有物id
            item.properties.unshift({ id: null, name: '全部' })
          })
          subFilterData.value = res.result
          filterLoad.value = false // 加载完毕
        })
      }
    }, { immediate: true })

    //    0.获取筛选参数得函数
    const getFilterParams = () => {
    // obj= {
    //     brandId: brandId,
    //     attrs: [
    //       {
    //         groupName: ProType.name, // 属性组名称，比如 尺码
    //         propertyName: subItem.name// 属性名称，比如59cm（建议0-3个月）
    //       }
    //     ]
    //   }
      const obj = { brandId: null, attrs: [] }
      // 品牌
      obj.brandId = subFilterData.value.selectedBrandId
      // 销售属性
      subFilterData.value.saleProperties.forEach(item => { // item是一行，包含属性组和属性项
        if (item.selectedProId) { // 如果存在设置的当前点击得id
          const prop = item.properties.find(pro => { // prop找到当前点击得属性那项
            return pro.id === item.selectedProId
          })
          obj.attrs.push({
            groupName: item.name, // 属性组名称，比如 尺码
            propertyName: prop.name// 属性名称，比如59cm（建议0-3个月）
          })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null // 这样写是因为如果没选择下面的属性，null就可以不放入到请求中
      return obj
    }

    //    1.记录当前选择得品牌
    const changeBrand = (brandId) => {
      // console.log(subFilterData.value.saleProperties)
      // 如果当前点击得，你还点击 就没必要发请求
      if (subFilterData.value.selectedBrandId === brandId) return
      subFilterData.value.selectedBrandId = brandId// 他俩一样 active就可以触发
      //   通知父组件，更新筛选数据
      emit('filter-change', getFilterParams())// 把obj传给父亲
    }

    // 2.记录当前选择得销售属性
    const changePro = (ProType, subItem) => { // 属性组，具体属性
      if (ProType.selectedProId === subItem.id) return
      ProType.selectedProId = subItem.id
      // 通知父组件，更新筛选数据
      emit('filter-change', getFilterParams())// 把obj传给父亲
    }
    return { subFilterData, filterLoad, changeBrand, changePro, getFilterParams }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
    background: #fff;
    padding: 25px;

    .item {
        display: flex;
        line-height: 40px;

        .head {
            width: 80px;
            color: #999;
        }

        .body {
            flex: 1;

            a {
                margin-right: 36px;
                transition: all .3s;
                display: inline-block;

                &.active,
                &:hover {
                    color: @b2cColor;
                }
            }
        }
    }
}

.b2c-skeleton {
    padding: 10px 0;
}
</style>
