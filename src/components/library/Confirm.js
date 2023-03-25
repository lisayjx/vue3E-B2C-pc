// 确认框

import { createVNode, render } from 'vue'
import B2cConfirm from './b2c-confirm'
// 准备一个dom
const div = document.createElement('div')
div.setAttribute('class', 'b2c-confirm-container')
document.body.appendChild(div)

// 返回的是promise对象，点击确认/取消都要销毁组件
export default ({ title, text }) => {
  // 创建组件步骤
  // 1.导入被创建的组件
  // 2.使用createVNode创建虚拟节点
  // 3.准备一个dom容器装载组件
  // 4.使用render函数渲染组件

  // 在promise里创建组件
  // 点击确认--触发确认回调--销毁组件  then代表确认
  // 点击取消--触发取消回调--销毁组件  catch代表取消
  return new Promise((resolve, reject) => {
    // 点击取消触发的函数
    const cancelCallback = () => {
      render(null, div)// 销毁组件
      reject(new Error('点击取消'))
    }
    // 点击确认触发的函数
    const submitCallback = () => {
      render(null, div)// 销毁组件
      resolve()
    }

    // 给组件 送出去两个回调函数
    const vn = createVNode(B2cConfirm, { title, text, cancelCallback, submitCallback })
    render(vn, div)// 把vn渲染到div
  })
}
