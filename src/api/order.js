import request from '@/utils/request'

/**
 * 获取结算信息(结算页面-创建订单)
 */
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}

/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (address) => {
  return request('/member/address', 'post', address)
}

/**
 * 修改 编辑 收货地址
 * @param {Object} form - 参考接口文档
 */
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

/**
 * 提交订单
 * @param {Object} order - 订单信息对象
 */
export const submitOrder = (order) => {
  return request('/member/order', 'post', order)
}
/**
 * 获取订单详情-结算页面用
 * @param {String} id - 订单ID
 */
export const findOrder = (id) => {
  return request('/member/order/' + id, 'get')
}
