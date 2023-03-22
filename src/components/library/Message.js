// 提供一个能够显示b2c-message组件的函数
// 这个函数将来:导入直接使用，也可以挂载在vue实例原型上
// import Message from 'Message.js '  Message({type : 'error ' , text: '提示文字})
// 如果挂载到原型上，使用：this.$message({type : 'error ' , text: '提示文字})

// vue中有一个函数createVNode可以把组件编译成dom节点，createVNode('组件','给组件传递得参数')
import { createVNode, render } from 'vue'
import B2cMessage from './b2c-message'
// 准备装载dom得容器
const div = document.createElement('div')// 创建div
div.setAttribute('class', 'b2c-message-container')// 起名字
document.body.appendChild(div)// 把div加到body中
// 定时器标识
let timer = null
export default ({ type, text }) => {
// 渲染组件
// 1．导入消息提示组件
// 2．将消息提示组件编译为虚拟节点(dom节点),因为组件是.vue，需要编译成html，css，js变成dom
  const vnode = createVNode(B2cMessage, { type, text })
  // 3．准备一个装载消息提示组件的dom容器来装dom节点

  // 4．将虚拟节点渲染在容器中，render(vue的虚拟节点，dom容器)
  render(vnode, div)
  // 5. 开启定时，移出DOM容器内容
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
