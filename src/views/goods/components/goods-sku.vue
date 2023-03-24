<template>
    <!-- 每一个按钮拥有selected disabled 类名，做 选中 和 禁用要用。 -->
    <div class="goods-sku">
        <dl v-for="item in goods.specs" :key="item.id">
            <dt>{{ item.name }}</dt>
            <dd>
                <template v-for="val in item.values" :key="val.name">
                    <img @click="clickSpecs(item,val)"   :class="{selected:val.selected,disabled:val.disabled}" v-if="val.picture" :src="val.picture" :title="val.name">
                    <span @click="clickSpecs(item,val)"  :class="{selected:val.selected,disabled:val.disabled}" v-else>{{ val.name }}</span>
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
    },
    skuId: { // 根据传人的sku设置默认选中的规格
      type: String,
      default: ''
    }
  },
  /* 大致步骤：
  依赖 goods.specs 渲染规格
  绑定按钮点击事件，完成选中和取消选中
  当前点的是选中，取消即可
  当前点的未选中，先当前规格按钮全部取消，当前按钮选中。 */
  setup (props, { emit }) {
    // console.log(props.goods)
    // 初始化默认选中状态
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }

    // 2.得到路径对象
    const pathMap = getPathMap(props.goods.skus)
    // console.log(pathMap)
    // #组件初始化:更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 1.选中与取消选中,约定在每一个按钮都有自己的选中状态selected和disabled
    // 1.1 点击的是已选中，只需要取消当前的选中
    // 1.2点击的是未选中，把同一个规格的其他按钮改成未选中，当前点击的改成选中
    const clickSpecs = (item, val) => {
      // 如果按钮是禁用得阻止程序运行
      if (val.disabled) return
      //   item当前类型,val当前具体的那项
      if (val.selected) { // 如果选中了
        val.selected = false
      } else { // 如果没选中
        // 先把这一行的其他选中 先干掉 一行不能出现多选
        item.values.forEach(bv => { bv.selected = false })
        val.selected = true
      }
      // #点击规格里按钮时:更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      //   将选择的sku规格信息 通知父组件(原价,现价,库存,属性值文字)
      // 每点一个按钮都会触发
      // 1．选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
      // 2.不是完整的sku组合按钮，提交空对象父组件
      //   我当前选中的数据,过滤无效的之后的长度=specs长度
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)// 过滤掉undefined
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}:${c.valueName}`, '').trim()
        })

        // reduce((上一个累加值,当前值)=>{})
      } else { // 选择的不完整
        //  父组件需要判断是否规格选择完整,不完整不能加购物车。
        emit('change', {})// 传递空{}为了 以后如果规格都没选择完 是不可以加入购物车的
      }
    }

    return { clickSpecs, getPathMap, pathMap, updateDisabledStatus }
  }
}
// ------------sku--------------------------------------
// 根据后台props.goods.skus数据得到全部规则,但是不一定都有库存,inventory为0就是没库存
//   1.得到skus集合,props.goods.skus
//   2.从skus中筛选出有效的skus
//   3.根据有效的sku使用power-set算法得到子集
//   4.根据子集 往路径字典对象中存储 key-value
const spliter = '★'
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
        const key = arr.join(spliter)
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
// 更新按钮禁用状态(初始化 和 点击规格时)
const updateDisabledStatus = (specs, pathMap) => {
// 1.每个按钮都需要获取到状态,需要在每个按钮上加一个属性 disabled控制
  specs.forEach((spec, i) => {
    const selectedValues = getSelectedValues(specs) // 拿到当前点击得数组
    spec.values.forEach(val => {
      // 2.判断当前是否选中 ,选中就不用判断
      if (val.selected) return
      // 3.如果没选中,就拿当前的值按照顺序套入选中的值数组  ['黑色', undefined, undefined]
      selectedValues[i] = val.name // 替换undefined啥的
      // 4.剔除undefined数据,按照分隔符拼接key
      const key = selectedValues.filter(value => value).join(spliter) // 5.去路径字典中查找是否有数据,有就可以点击,没有禁用
      //   val.disabled = !pathMap[val.name]// pathMap[val.name]的值,找到了可点,没找到禁用
      val.disabled = !pathMap[key]
    })
  })
}
// 拿到当前选中得值得数组,每一行中选中得那项得数组
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 选中得按钮对象
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
// 初始化选中状态(默认选中)
// 根据sku找到选中的按钮
const initDefaultSelected = (goods, skuId) => {
// 1.找出sku信息
  const sku = goods.skus.find(sku => sku.id === skuId)
  console.log(goods.skus)
  //   2.遍历每一个按钮,按钮的值和sku记录的值相同就选中
  goods.specs.forEach((item, i) => { // item.values每个按钮
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
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
