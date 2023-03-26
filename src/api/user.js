import request from '@/utils/request'

/**
 * 帐号登录
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

/**
 * 获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}
/**
 * 短信登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}
/**
 *  qq 第三方登录
 * @param {String} unionId - 第三方登录唯一标识
 * @param {Integer} source - 来源 1为pc，2为webapp，3为微信小程序，4为Android，5为ios,6为qq,7为微信
 * @returns Promise
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}
/**
 * qq 第三方登录-获取短信登录验证码
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}
/**
 * qq 第三方登录-通过短信绑定进行登录
 * @param {String} mobile - 手机号
* @param {String} unionId - 第三方登录唯一标识
 * @param {String} code - 验证码
 * @returns Promise
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}
/**
 * 校验帐号（用户名）是否存在
 * @param {String} account - 帐号
 * @returns Promise
 */
export const userCheckAccount = (account) => {
  return request('/register/check', 'get', { account })
}
/**
 * 获取短信验证码-注册-PC （完善信息callback-patch）
 * @param {String} account - 帐号
 * @returns Promise
 */
export const userQQPitchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}
/**
 *  (完善信息)通过短信绑定进行登录 三方登录-完善信息
 * @param {String} mobile - 手机号
*  @param {String} unionId - 第三方登录唯一标识openId
 * @param {String} code - 验证码
 * @param {String} account - 帐号
 * @param {String} password - 密码
 * @returns Promise
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password })
}
// 解绑电话号
export const unBindMobile = (mobile) => {
  return request('/login/social/unbind', 'get', { mobile })
}
/**
 *  注册
 * @param {String} account - 帐号
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} password - 密码
 * @param {type} type - PC端默认不传此值，app必传且值为app
 * @returns Promise
 */
export const register = ({ account, mobile, code, password }) => {
  return request('/register', 'post', { account, mobile, code, password })
}
/**
 * 获取短信验证码-注册-PC
 * @param {String} mobile - 手机号
 * @returns Promise
 */
export const getRegisterCodePc = (mobile) => {
  return request('/register/code', 'get', { mobile })
}
