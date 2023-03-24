import request from '@/utils/request'

/**
 * 获得最新商品信息-库存，价格，是否有效（支持本地购物车）每次只能请求到一个商品
 * @param {String} skuId -路径里的- SKU_ID
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}
