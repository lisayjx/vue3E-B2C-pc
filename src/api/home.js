// 首页相关API
import request from '@/utils/request'
/**
 * 获取品牌推荐（左侧导航最下面的推荐数据,还有内容里的获取热门品牌）
 * @param {Integer} limit - 品牌个数
 * @return Promise
 */
export const getBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取banner轮播广告图
 * @return Promise
 */
export const getBanner = () => {
  return request('/home/banner', 'get')
}

/**
 * 获取新鲜好物数据
 * @return Promise
 */
export const getNew = () => {
  return request('home/new', 'get')
}
/**
 * 获取人气推荐数据
 * @return Promise
 */
export const getHot = () => {
  return request('home/hot', 'get')
}
/**
 * 获取 商品区块 数据
 * @return Promise
 */
export const getGoods = () => {
  return request('home/goods', 'get')
}
/**
 * 获取 最新专题 数据
 * @return Promise
 */
export const getSpecial = () => {
  return request('home/special', 'get')
}
