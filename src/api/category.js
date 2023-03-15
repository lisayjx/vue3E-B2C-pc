// 分类模块，定义首页需要的接口函数
import request from '@/utils/request'
/**
 * 获取所有分类（顶级，二级，对应的商品推荐数据）
 * @returns Promise
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取单个顶级分类信息 需要分类id  一级类目-PC（里面的children属性就是各个子分类）
 * @returns Promise
 * @id 顶级类目id
 */
export const getTopCategory = (id) => {
  return request('/category', 'get', { id })
}
/**
 * 二级类目-筛选条件
 * @returns Promise
 * @id 二级类目id
 */
export const getSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}
/**
 * 二级类目-筛选条件-获取分类下的商品（带筛选条件）
 * 商品列表_临时
 * @returns Promise
 * @params {object}-参考文档
 * 未提交排序字段（sortField）则视为综合排序
 */
export const getSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'POST', params)
}
