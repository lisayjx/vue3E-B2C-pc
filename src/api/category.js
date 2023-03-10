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
