<!-- jsx语法写，组件tabs-panel组件 -->
<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'B2cTabs',
  props: {
    modelValue: { // activeName
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 得到一个响应式得activeName,index父页面得activeName也会更新
    const activeName = useVModel(props, 'modelValue', emit)

    // 点击 选项卡 切换activeName名字
    const tabClick = (name, i) => { // 当前选项卡得name和索引
      activeName.value = name
      //   提供一个自定义事件
      emit('tab-click', i)
    }
    // 把activeName传递给子孙，给每一个panel传递当前激活的name
    provide('activeName', activeName)
    return { activeName, tabClick }
  },
  render () {
    // 需要在这里进行组织
    // 1.tabs组件大容器
    // 2.选项卡的导航菜单结构
    // 3.内容容器

    // 2.选项卡的导航菜单结构
    // 获取order/index页面 里b2c-tabs组件里的插槽内容  （几个panel组件）
    // label选项卡的文字，name选项卡的唯一标识，panels的长度就是选项卡的个数
    const panels = this.$slots.default()// panels就是 装着所有panel的面板，this是tabs组件
    // console.log(panels, 'panels')
    // 得到动态(v-for)生成的panels集合和静态生成的panels集合
    const dynamicPanels = []
    panels.forEach(item => {
      // 静态
      if (item.type.name === 'B2cTabsPanel') {
        dynamicPanels.push(item)
      } else { // 动态遍历的
        item.children.forEach(child => {
          dynamicPanels.push(child)
        })
      }
    })

    // 选项卡依赖于 order/index页面 里 panel组件的label
    const nav = (
        <nav>
        {
            dynamicPanels.map((panel, i) => {
              return (
                <a
                class={{ active: panel.props.name === this.activeName }}
                href="javascript:;"
                onClick={() => this.tabClick(panel.props.name, i)}
                >
                {panel.props.label}
                </a>
              )
            })
        }
    </nav>
    )
    // 3.内容容器
    // 选项卡依赖于 order/index页面 里 b2c-tabs-panel组件的 插槽内容
    // 可以去这个组件里 写一个容器，比较省事s
    // const content = <div>
    //   <div>内容1</div>
    //   <div>内容2</div>
    //   <div>内容3</div>
    // </div>
    return <div class="b2c-tabs-container">{[nav, dynamicPanels]}</div>
  }
}
</script>

<style lang="less" scoped>
.b2c-tabs-container {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @b2cColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
