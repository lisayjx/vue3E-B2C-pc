<template>
     <p class="g-name">{{goods.name}}</p>
  <p class="g-desc">{{goods.desc}}</p>
  <p class="g-price">
    <span>{{goods.price}}</span>
    <span>{{goods.oldPrice}}</span>
  </p>
    <div class="g-service">
      <dl>
        <dt>促销</dt>
        <dd>12月好物放送，App领券购买直降120元</dd>
      </dl>
      <dl>
        <dt>配送</dt>
        <dd>至
                    <!-- 配送地址 组件 -->
                    <b2c-city :fullLocation="fullLocation" @change="changeCity"/>
        </dd>
      </dl>
      <dl>
        <dt>服务</dt>
        <dd>
          <span>无忧退货</span>
          <span>快速退款</span>
          <span>免费包邮</span>
          <a href="javascript:;">了解详情</a>
        </dd>
      </dl>
    </div>
  </template>

<script>
import { ref } from 'vue'
export default {
  name: 'GoodName',
  props: {
    goods: {
      type: Object,
      default: () => {}
    }
  },
  setup (props) {
    // 1.父组件设置 省市区的code数据，对应的文字数据。传给b2c-city
    // 默认情况
    const provinceCode = ref('110000')
    const cityCode = ref('119900')
    const countyCode = ref('110101')
    const fullLocation = ref('北京市 市辖区 东城区')

    // 有默认地址
    if (props.goods.userAddresses) {
      const defaultAddr = props.goods.userAddresses.find(addr => addr.isDefault === 1)
      if (defaultAddr) { // 找到当前带isDefault=1的那项 是默认地址
        provinceCode.value = defaultAddr.provinceCode
        cityCode.value = defaultAddr.cityCode
        countyCode.value = defaultAddr.countyCode
        fullLocation.value = defaultAddr.fullLocation
      }
    }
    // 改变地址
    const changeCity = (result) => {
      // console.log(result)// b2c-city传来的完整对象 包含省市区
      provinceCode.value = result.provinceCode
      cityCode.value = result.cityCode
      countyCode.value = result.countyCode
      fullLocation.value = result.fullLocation
    }
    return { fullLocation, changeCity }
  }
}
</script>

  <style lang="less" scoped>
  .g-name {
    font-size: 22px
  }
  .g-desc {
    color: #999;
    margin-top: 10px;
  }
  .g-price {
    margin-top: 10px;
    span {
      &::before {
        content: "¥";
        font-size: 14px;
      }
      &:first-child {
        color: @priceColor;
        margin-right: 10px;
        font-size: 22px;
      }
      &:last-child {
        color: #999;
        text-decoration: line-through;
        font-size: 16px;
      }
    }
  }
  .g-service {
    background: #f5f5f5;
    width: 500px;
    padding: 20px 10px 0 10px;
    margin-top: 10px;
    dl {
      padding-bottom: 20px;
      display: flex;
      align-items: center;
      dt {
        width: 50px;
        color: #999;
      }
      dd {
        color: #666;
        &:last-child {
          span {
            margin-right: 10px;
            &::before {
              content: "•";
              color: @b2cColor;
              margin-right: 2px;
            }
          }
          a {
            color: @b2cColor;
          }
        }
      }
    }
  }
  </style>
