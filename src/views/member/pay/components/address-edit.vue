<template>
    <!-- 修改和添加地址组件 -->
    <B2cDialog :title="formTitle" v-model:visible="dialogVisible">
        <div class="address-edit">
            <div class="b2c-form">
                <div class="b2c-form-item">
                    <div class="label">收货人：</div>
                    <div class="field">
                        <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
                    </div>
                </div>
                <div class="b2c-form-item">
                    <div class="label">手机号：</div>
                    <div class="field">
                        <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
                    </div>
                </div>
                <div class="b2c-form-item">
                    <div class="label">地区：</div>
                    <div class="field">
                        <B2cCity placeholder="请选择所在地区"
                        :fullLocation="formData.fullLocation"
                       @change="changeCity"
                        />
                    </div>
                </div>
                <div class="b2c-form-item">
                    <div class="label">详细地址：</div>
                    <div class="field">
                        <input  v-model="formData.address" class="input" placeholder="请输入详细地址" />
                    </div>
                </div>
                <div class="b2c-form-item">
                    <div class="label">邮政编码：</div>
                    <div class="field">
                        <input  v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
                    </div>
                </div>
                <div class="b2c-form-item">
                    <div class="label">地址标签：</div>
                    <div class="field">
                        <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
                    </div>
                </div>
            </div>
        </div>
        <template v-slot:footer>
            <B2cButton @click="dialogVisible = false" type="gray" style="margin-right:20px">取消</B2cButton>
            <B2cButton @click="confirmAddress" type="primary">确认</B2cButton>
        </template>
    </B2cDialog>
</template>
<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'AddressEdit',
  emits: ['on-success'],
  computed: {
    formTitle (val) {
      val = this.formData.id ? '编辑' : '添加'
      return val + '收货地址'
    }
  },
  setup (props, { emit }) {
    const dialogVisible = ref(false)
    // 打开函数,由他的父组件checkout-address控制
    const open = (waitEditAddress) => { // waitEditAddress父组件传过来的需要修改的地址对象
      //  1.如果是修改
      if (waitEditAddress.id) { // 如果有传来的waitEditAddress如果有id就是修改
        // 组件被打开的时候 把需要修改的数据展现出来
        // formData = waitEditAddress 这么写不对
        for (const key in formData) {
          formData[key] = waitEditAddress[key]
        }
      } else {
        //   2.如果是添加
        //   打开之前 清空上一次添加的表单数据
        for (const key in formData) {
          if (key === 'isDefault') { // isDefault值比较特殊
            formData[key] = 1
          } else {
            formData[key] = null
          }
        }
      }

      dialogVisible.value = true
    }
    // 表单数据
    // 有id的就是添加，没有的就是修改
    const formData = reactive({
      id: '', //    有id的就是修改，没有的就是添加
      receiver: '',
      contact: '', // 联系方式
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 1, // 1 不是默认地址
      //   城市组件显示文字（完整的行政区地址）
      fullLocation: ''//    +
    })
    // 选择地区
    const changeCity = (data) => { // data就是city组件传来的你当前选择的省市区编码 全名
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }
    // 点击确认(添加/修改)
    // const app = getCurrentInstance()// 获取vue实例
    const confirmAddress = () => {
      dialogVisible.value = false
      // 如果formData里有id了就是修改,没有id就是添加
      if (formData.id) {
        // 1.修改
        editAddress(formData).then(data => {
        // 修改成功
          Message({ text: '修改收货地址成功', type: 'success' })
          dialogVisible.value = false
          emit('on-success', formData)
        })
      } else {
        // 2.添加 把地址存入地址列表
        addAddress(formData).then(data => {
        // 添加成功（省略了校验）
          Message({ text: '添加收货地址成功', type: 'success' })
          dialogVisible.value = false// 关闭弹窗
          formData.id = data.result.id// 这个地址对象本来没有id，需要添加，之后才能通过id进行修改

          // 把当前新加入的地址id给表单（后台是加了 前端没加呢 所以写这个，或者再次请求order数据 他里面就包括了新添加的地址）
          emit('on-success', formData)// 通知父组件更新
        })
      }
    }
    return { dialogVisible, open, formData, changeCity, confirmAddress }
  }
}
</script>
<style scoped lang="less">

    .b2c-dialog {
  :deep(.wrapper){
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.b2c-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.b2c-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}

</style>
