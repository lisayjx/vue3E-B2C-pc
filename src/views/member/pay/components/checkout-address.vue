<template>
    <div class="checkout-address">
        <div class="text">
            <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
            <ul v-if="showAddress">
                <li><span>收<i />货<i />人：</span>{{ showAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2') }}</li>
                <li><span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g, '') + showAddress.address }}</li>
            </ul>
            <a href="javascript:;" @click="visibleDialog=true">修改地址</a>
        </div>
        <div class="action">
            <B2cButton v-if="showAddress" class="btn" @click="openDialog">切换地址</B2cButton>
            <B2cButton class="btn" @click="visibleDialog=true">添加地址</B2cButton>
        </div>

    </div>

         <!-- 添加地址弹窗 组件 -->
    <!-- vue3.0 仅支持v-slot+template/#写法 -->
    <B2cDialog title="切换收货地址" v-model:visible="visibleDialog">
        <!-- 默认插槽 -->
        <div class="text item"
        :class="{active:selectedAddress&&selectedAddress.id===item.id}"
        @click="selectedAddress=item"
         v-for="item in userAddresses"
          :key="item.id">
            <ul>
                <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
                <li><span>联系方式：</span>{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2') }}</li>
                <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g, '') + item.address }}</li>
            </ul>
        </div>
        <!-- 具名插槽 -->
        <template #footer>
            <B2cButton @click="visibleDialog = false" type="gray" style="margin-right:20px">取消</B2cButton>
            <B2cButton @click="confirmAddress" type="primary">确认</B2cButton>
        </template>
    </B2cDialog>

</template>
<script>
import { ref } from 'vue'
export default {
  name: 'CheckoutAddress',
  props: {
    userAddresses: {
      type: Array,
      default: () => []
    }
  },
  // 1．在拥有根元素的组件中，触发自定义使用，有没有emits选项无所谓
  // 2．如果你的组件渲染的代码片段，vue3.0规范，需要在emits中申明你所触发的自定义事件
  // 3．提倡:你发了自定义事件，需要在emits选项申明下
  emits: ['change'],
  setup (props, { emit }) {
    // 1．找到默认收货地址   isDefault 0就是有默认地址
    // 2．没有默认收货地址，使用第一条收货地址
    // 3．如果没有数据,就提示添加数据

    const showAddress = ref(null)// 显示的地址
    const defaultAddress = props.userAddresses.find(item => item.isDefault === 0)

    if (defaultAddress) { // 如果有默认地址
      showAddress.value = defaultAddress
    } else { // 如果没有默认地址，使用第一条
      if (props.userAddresses.length) {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.userAddresses[0] // 加上一个注释：忽略检查，不是错
      }
    }
    //  显示和隐藏弹框
    const visibleDialog = ref(false)

    // 当父亲checkout初始化时候如果有默认地址，就把默认地址id传给父组件
    // emit('change', showAddress.value?.id)
    // emit('change', showAddress.value && showAddress.value.id)// 如果前面成立就把后面送出去，前面不成立就是null
    emit('change', showAddress.value?.id)// 如果value有值，就取id

    // 记录下你当前选中的地址对象
    const selectedAddress = ref(null)
    // 点击确认地址
    const confirmAddress = () => {
      visibleDialog.value = false
      // 1.把你选择的地址展示到checkout页面(把checkout页显示的地址换成你选中的地址)
      showAddress.value = selectedAddress.value
      //   2.把你选中的地址id发送给结算组件checkout页面，后续需要传给后端的
      emit('change', selectedAddress.value.id)
    }

    // 点击切换地址
    const openDialog = () => {
      // 打开时候先将数据置空
      selectedAddress.value = null// 为了防止你下一次打开时候有上次选中的地方
      visibleDialog.value = true
    }
    return { showAddress, visibleDialog, selectedAddress, confirmAddress, openDialog }
  }
}
</script>
<style scoped lang="less">
.checkout-address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;

    .text {
        flex: 1;
        min-height: 90px;
        display: flex;
        align-items: center;

        .none {
            line-height: 90px;
            color: #999;
            text-align: center;
            width: 100%;
        }

        >ul {
            flex: 1;
            padding: 20px;

            li {
                line-height: 30px;

                span {
                    color: #999;
                    margin-right: 5px;

                    >i {
                        width: 0.5em;
                        display: inline-block;
                    }
                }
            }
        }

        >a {
            color: @b2cColor;
            width: 160px;
            text-align: center;
            height: 90px;
            line-height: 90px;
            border-right: 1px solid #f5f5f5;
        }
    }

    .action {
        width: 420px;
        text-align: center;

        .btn {
            width: 140px;
            height: 46px;
            line-height: 44px;
            font-size: 14px;

            &:first-child {
                margin-right: 10px;
            }
        }
    }
}

// 对话框
.b2c-dialog {
  .text {//每一个
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @b2cColor;
        // background: lighten(@b2cColor,50%);//使用 lighten() 和 darken() 函数来修改 50% 的亮度值
background: #f0ded1;
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
