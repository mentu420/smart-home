import { request } from '@/utils/request/'

// 授信登录
export const getAuthToken = async (params) =>
  request({
    url: '/user/accountlogin/settoken',
    method: 'POST',
    withToken: false,
    retry: 0,
    params: {
      ...params,
      systemCode: import.meta.env.VITE_APP_CLIENT_CODE,
    },
  })

//用户登录
export const getUserToken = (params) =>
  request({
    url: '/user/accountlogin/ordinary',
    method: 'POST',
    withToken: false,
    retry: 0,
    params: {
      ...params,
      systemCode: import.meta.env.VITE_APP_CLIENT_CODE,
    },
  })

//获取用户信息
export const getUserInfo = (params) => request({ url: '/cdapi/app/userinfo', params })

//修改密码
export const changePassword = (params) => {
  return request({
    url: '/cd-sys-web/v1/app/password',
    params,
    method: 'post',
  })
}

//设置用户资料
export const setAvatar = (data) => request({ url: '/cdapi/app/user/update', method: 'post', data })

//记录用户最后登录数据
export const saveLastTime = (params) =>
  request(
    {
      url: '/cdapi/app/update/lastlogintime',
      params,
    },
    { withShowErrorMsg: false }
  )

//请求门店单列表
export const getShopList = (params) =>
  request({ url: '/cd-sys-web/v1/api/writeofforder/shopList', params })

//请求用户的店铺详细地址
export const getShopAdress = (params) =>
  request({ url: '/cd-sys-web/v1/api/writeofforder/channelSideList', params })

//合拼crm账号
export const accountMarge = () => request({ url: '/cdapi/app/update/user/account', method: 'post' })

//获取用户收藏
export const getcollect = (params) =>
  request({ url: '/consumer-admin/api/user/collect/v1/getcollect', params })

//修改用户手机号码
export const setUserPhone = (params) =>
  request({
    url: '/cdapi/app/user/update/phone',
    params,
    method: 'post',
  })

//查询履历
export const getMeHistory = (params) =>
  request({
    url: '/consumer-admin/api/train/repository/v1/getroster',
    params,
  })

//查询品牌
export const getUserPlatform = (data) =>
  request({
    url: '/consumer-admin/api/question/repository/v2/joinin/brand',
    data,
    method: 'post',
  })

//根据账号查询用户手机号
export const getUserPhone = (params) => request({ url: '/cdapi/app/abridge/user', params })

//获取短信验证码
export const fetchSms = (params) => request({ url: '/cdapi/app/send', params, method: 'post' })

//验证码修改密码
export const editUserPassword = (params) =>
  request({ url: '/cdapi/app/updatePwd', params, method: 'post' })

//获取wx jssdk config
export const getTicket = (params) => request({ url: '/consumer-admin/api/wx/getTicket', params })

//员工获取职位
export const getStaffPosition = (params) =>
  request({ url: '/consumer-admin/v2/api/cert/approve/getAuth', params })

//员工获取用户信息
export const getStaffInfo = (params) =>
  request({ url: '/consumer-admin/app/userinfo', params, errToast: false })

//用户职位列表
export const getPositionMap = (params) => request({ url: '/cdapi/position/getPositionMap', params })

//查询员工 所属经销商列表
export const getDealerShopList = (params) => request({ url: '/cdapi/shop/dealerShoplist', params })

//查询经销商门店所属区域裂变
export const getShopRegion = (params) => request({ url: '/cdapi/shop/getShopRegion', params })

//
export const getPlaceOrderPower = (params) =>
  request({
    url: '/cd-sys-web/sys/config/list',
    params,
  })

// 查询客户参考系
export const getReferenceList = (params) =>
  request({
    url: '/consumer-admin/dl/reference/list',
    params,
  })

// 微信公众号获取openId
export const getWxOpenId = (params) =>
  request({
    url: '/consumer-admin/api/wx/getSnsToken',
    params,
  })

// 账号绑定微信openId
export const mergeWxOpenId = (data) =>
  request({
    url: '/user/logintype/add',
    data,
    method: 'post',
  })

// 更新用户绑定信息
export const udpateLoginType = (data) =>
  request({
    url: '/user/logintype/update',
    data,
    method: 'post',
  })

// 获取登录类型
export const getLoginType = (params) =>
  request({
    url: '/user/logintype/list',
    params,
  })

// 获取门店综合信息
export const getShopDetail = (params) =>
  request({
    url: '/dealermanage/shop/getDealerShopAllInfo',
    params,
  })

// 更新门店综合信息
export const upateShopDetail = (data) =>
  request({
    url: '/dealermanage/shop/updateShopBase',
    data,
    method: 'POST',
  })

// 获取金蝶员工信息
export const getEmployeeInfo = (params) =>
  request({
    url: '/datasync/app/employee/getEmployeeInfo',
    params,
  })

// 获取金蝶员工信息
export const setEmployeeAccount = (data) =>
  request({
    url: '/datasync/app/employee/createOrBinding',
    data,
    method: 'POST',
  })

// 设置用户当前职位
export const updateUserInfo = (data) =>
  request({
    url: '/cdapi/app/user/update',
    data,
    method: 'POST',
  })

// 查询经销商授权品牌信息
export const getDealerBrandDetail = (params) =>
  request({
    url: '/cdapi/shop/brand/detailList',
    params,
  })

// 获取门店
export const getShopByDeadler = (params) => {
  return request({
    url: '/cd-sys-web/v3/app/storeShoplist/byDeadler',
    params,
  })
}
