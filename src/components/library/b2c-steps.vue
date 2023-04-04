<!--
  https://www.bilibili.com/video/BV1Mu411B7hT?p=173&vd_source=2fd18316f23162e685d8dbdadd9417f1
  把steps分成 一个一个小组件
 -->
<script>
export default {
  name: 'B2cSteps',
  props: {

    active: {
      type: Number,
      default: 1
    }
  },

  // jsx语法
  render () {
    // 1.获取到默认插槽的节点（获取detail-step页的b2c-steps里面的内容）
    const items = this.$slots.default()
    // console.log(items)// 能 获取到b2c-steps插槽里b2c-steps-item里的title和desc
    // 2.获取动态遍历（v-for）生成的B2cStepsItem组件节点
    const dynamicItems = []
    items.forEach((item) => {
      if (item.type.name === 'B2cStepsItem') {
        // 静态的
        dynamicItems.push(item)
      } else {
        // v-for生成的动态的
        item.children.forEach((child) => {
          dynamicItems.push(child)
        })
      }
    })
    // 3.根据动态节点 生成 item的jsx对象
    const itemsJsx = dynamicItems.map((item, i) => {
      return (
        <div class="b2c-steps-item" class={{ active: i < this.active }}>
          <div class="step">
            <span>{i + 1}</span>
          </div>
          <div class="title">{item.props.title}</div>
          <div class="desc">{item.props.desc}</div>
        </div>
      )
    })
    // 4.插入到大容器中
    return <div class="b2c-steps">{itemsJsx}</div>
  }
}
</script>
  <style lang="less">
.b2c-steps {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @b2cColor;
          background: @b2cColor;
          color: #fff;
        }
        &::before,
        &::after {
          background: @b2cColor;
        }
      }
      .title {
        color: @b2cColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after,
      &::before {
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
        left: 0;
      }
      &::after {
        right: 0;
      }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
