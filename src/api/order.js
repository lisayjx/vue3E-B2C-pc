import request from '@/utils/request'

/**
 * 获取结算信息(结算页面-创建订单)
 */
export const createOrder = () => {
  return request('/member/order/pre', 'get')
}
