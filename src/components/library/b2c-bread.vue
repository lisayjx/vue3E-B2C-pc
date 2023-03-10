
<script>
import { h } from 'vue'

export default {
  name: 'B2cBread',
  /*   vue2.0的h函数传参进来的
  render: h => {
    return ''  返回值就是组件内容
  } */
  /*   vue 3.0的h函数导入进来
  render () {
    h第一个参数：标签名字，第二个参数：标签属性对象，第三个参数：子节点
     return h('div', { class: 'b2c-bread' }, '子节点')
  } */
  // 需求
  // 1. 创建b2c-bread父容器
  // 2. 获取默认插槽内容
  // 3. 去除xtx-bread-item组件的i标签，因该由render函数来组织
  // 4. 遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
  // 5. 把动态创建的节点渲染再xtx-bread标签中
  render () {
    const items = this.$slots.default() // 获取默认插槽内容
    const dynamicsItems = []// 装拼凑好的，首页>电器>空调
    items.forEach((item, index) => {
      dynamicsItems.push(item)
      if (index !== 0 && index < items.length - 1) { // 最后一个没有右侧箭头
        dynamicsItems.push(h('i', { class: 'iconfont icon-angle-right' }))// 箭头
      }
    })
    return h('div', { class: 'b2c-bread' }, dynamicsItems)
  }
}
</script>

  <style  lang='less'>
//   取出scoped，让他作用域b2c-bread-item上
  .b2c-bread{
    display: flex;
    padding: 25px 10px;
    &-item {
      a {
        color: #666;
        transition: all .4s;
        &:hover {
          color: @b2cColor;
        }
      }
    }
    i {
      font-size: 12px;
      margin-left: 5px;
      margin-right: 5px;
      line-height: 22px;
    }
  }
  </style>
