<template>
    <!-- 每一个按钮拥有selected disabled 类名，做 选中 和 禁用要用。 -->
    <div class="goods-sku">
        <dl v-for="item in goods.specs" :key="item.id">
            <dt>{{ item.name }}</dt>
            <dd>
                <template v-for="val in item.values" :key="val.name">
                    <img @click="clickSpecs(item,val)" :class="{selected:val.selected}" v-if="val.picture" :src="val.picture" :title="val.name">
                    <span @click="clickSpecs(item,val)"  :class="{selected:val.selected}" v-else>{{ val.name }}</span>
                </template>
            </dd>
        </dl>

    </div>
</template>
<script>
import getPowerSet from '@/vender/power-set' // 引入幂集算法
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: [], skus: [] })
    }
  },
  /* 大致步骤：
  依赖 goods.specs 渲染规格
  绑定按钮点击事件，完成选中和取消选中
  当前点的是选中，取消即可
  当前点的未选中，先当前规格按钮全部取消，当前按钮选中。 */
  setup (props) {
    // 1.选中与取消选中,约定在每一个按钮都有自己的选中状态selected和disabled
    // 1.1 点击的是已选中，只需要取消当前的选中
    // 1.2点击的是未选中，把同一个规格的按钮改成未选中，当前点击的改成选中
    const clickSpecs = (item, val) => {
    //   item当前类型,当前具体的那项
      if (val.selected) { // 如果选中了
        val.selected = false
      } else { // 如果没选中
        // 先把这一行的其他选中 先干掉 一行不能出现多选
        item.values.forEach(bv => { bv.selected = false })
        val.selected = true
      }
    }
    // 2.得到路径对象
    const pathMap = getPathMap(props.goods.skus)
    console.log(pathMap)

    return { clickSpecs, getPathMap, pathMap }
  }
}
// ------------sku--------------------------------------
// 根据后台props.goods.skus数据得到全部规则,但是不一定都有库存,inventory为0就是没库存
//   1.得到skus集合,props.goods.skus
//   2.从skus中筛选出有效的skus
//   3.根据有效的sku使用power-set算法得到子集
//   4.根据子集 往路径字典对象中存储 key-value
// const spliter = '★'
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    // 1. 过滤出有库存有效的sku
    if (sku.inventory > 0) { // 如果大于0都是有效的库存
      // 2. 得到sku属性值(可选值数组)数组,因为skus是个对象,我们要取到它里面的名字 形成数组
      const specs = sku.specs.map(spec => spec.valueName)
      // 3. 得到sku属性值数组的子集 例如[1,2]==>[[1],[2],[1,2]]
      const powerSet = getPowerSet(specs)
      // 4. 设置给路径字典对象pathMap,key-value,key就是每个子集,value就是skuID
      // 遍历子集powerSet,往pathMap插数据
      powerSet.forEach(arr => { // 每个子集的数组
        // 把数组转化成字符串 用★连接,这就是key,例如['中国',30]==>中国★30
        const key = arr.join('★')
        //    给pathMap插数据
        if (pathMap[key]) { // 如果有相同的key值,就push新的东西
          pathMap[key].push(sku.id)
        } else { // 如果没有相同的key就直接赋值
          pathMap[key] = [sku.id] // key:value
        }
      })
    }
  })

  return pathMap
}

</script>
<style scoped lang="less">
.sku-state-mixin () {
    border: 1px solid #e4e4e4;
    margin-right: 10px;
    cursor: pointer;

    &.selected {
        border-color: @b2cColor;
    }

    &.disabled {
        opacity: 0.6;
        border-style: dashed;
        cursor: not-allowed;
    }
}

.goods-sku {
    padding-left: 10px;
    padding-top: 20px;

    dl {
        display: flex;
        padding-bottom: 20px;
        align-items: center;

        dt {
            width: 50px;
            color: #999;
        }

        dd {
            flex: 1;
            color: #666;

            >img {
                width: 50px;
                height: 50px;
                .sku-state-mixin ();
            }

            >span {
                display: inline-block;
                height: 30px;
                line-height: 28px;
                padding: 0 20px;
                .sku-state-mixin ();
            }
        }
    }
}</style>
