import request from '@/utils/request'

/**
 * 获取收藏-分页数据
 * @param  page - 页码
 * @param  pageSize - 页尺寸
 * @param {Integer} collectType - 收藏类型，1为商品，2为专题，3为品牌
 * @return Promise
 */
export const getCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}
