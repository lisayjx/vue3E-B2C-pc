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
/**
 * 查询我的订单列表-all选项
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const findOrderList = ({ orderState, page, pageSize }) => {
  return request('/member/order', 'get', { orderState, page, pageSize })
}
/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = (orderId, cancelReason) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}
/**
 * 删除订单
 * @param {Array<string>} ids - 删除订单，id集合
 * @returns
 */
export const deleteOrder = (orderId) => {
  return request('/member/order', 'delete', { ids: [orderId] })
}
/**
 * 确认收货
 * @param {String} id - 订单id
 * @returns
 */
export const confirmOrder = (id) => {
  return request(`/member/order/${id}/receipt`, 'put')
}
/**
 * 查看物流
 * @param {String} id - 订单ID
 * @returns
 */
export const logisticsOrder = (id) => {
  return request(`/member/order/${id}/logistics`, 'get')
}
