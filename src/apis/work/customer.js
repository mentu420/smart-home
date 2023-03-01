import { request } from '@/utils/request/'

//检查用户手机与微信
export const checkContact = (params) =>
  request(
    {
      url: '/cd-sys-web/v3/app/customer/check',
      params,
    },
    { withShowErrorMsg: false }
  )

//新增、编辑用户
export const updataCustomer = (data) =>
  request({
    url: '/cd-sys-web/v3/app/customer/update',
    data,
    method: 'post',
  })

//更新地址状态
export const updateAddressStatus = (data) =>
  request({ url: '/cd-sys-web/v2/app/address/status', data, method: 'post' })

//更新地址
export const updateAddress = (data) =>
  request({ url: '/cd-sys-web/v2/app/address/update', data, method: 'post' })

//获取地址列表
export const getAddressList = (params) =>
  request({ url: '/cd-sys-web/v2/app/address/list', params })

//新建跟踪记录
export const addFollow = (data) =>
  request({
    url: '/cd-sys-web/v3/app/trackrecord/update',
    data,
    method: 'post',
  })

//获取用户详细
export const getCustomerDetail = (params) =>
  request({ url: '/cd-sys-web/v3/app/customer/details', params })

//添加游客
export const addVisitor = (data) =>
  request({ url: '/cd-sys-web/v3/app/customer/tourist', method: 'post', data })

//获取个人客户列表
export const getPersonalData = (params) =>
  request({ url: '/cd-sys-web/v3/app/customer/listbyuserId', params })

//获取门店客户所有客户列表
export const getStoreCustomer = (params) =>
  request({
    url: '/cd-sys-web/v3/app/customer/opportunity/trackrecord',
    params,
  })

//获取总部所有客户列表
export const getCompanyIntention = (params) =>
  request({
    url: '/cd-sys-web/v3/app/customer/opportunity/headquarters',
    params,
  })

//获取员工客户列表
export const getStaffCustomer = (params) =>
  request({ url: '/cd-sys-web/v3/app/customer/list', params })

//意向详信息选项
export const getReferenceOptions = (params) =>
  request({ url: '/cd-sys-web/v2/app/reference', params })

//获取客户意向
export const getIntentionDetail = (params) =>
  request({ url: '/cd-sys-web/v3/app/opportunity', params })

//获取客户地址
export const getCustomerAddress = (params) => request({ url: '/cd-sys-web/v2/app/address', params })

//关闭意向
export const closeIntention = (data) =>
  request({
    url: '/cd-sys-web/v3/app/opportunity/close',
    method: 'post',
    data,
  })

//搜索意向产品
export const searchProduts = (params) => request({ url: '/cd-sys-web/v2/app/product', params })

//新增、编辑意向
export const updataIntention = (data) =>
  request({
    url: '/cd-sys-web/v3/app/opportunity/update',
    data,
    method: 'post',
  })

//检查姓氏是否存在
export const checkLastName = (params) =>
  request({ url: '/cd-sys-web/v2/app/check/lastname', params })

//根据店长id获取所属店长相关门店信息
export const getShopListByUser = () =>
  request({ url: '/cd-sys-web/v3/app/getShopListByUserId' }, { withShowErrorMsg: false })

//批量修改跟进人获取店长所管门店跟进人列表
export const getManagerStoreAccount = () =>
  request({ url: '/cd-sys-web/v3/app/getManagerStoreAccount' })

//获取店长所管门店跟进人列表
export const getManagerAndSleepList = (params) =>
  request({ url: '/cd-sys-web/v3/app/getManagerAndSleepList', params })

//更换跟进人
export const setFollowPersons = (data) =>
  request({
    url: '/cd-sys-web/v3/app/customer/opportunity/updateFollow',
    data,
    method: 'post',
  })

//合拼客户信息
export const mergeCustomer = (data) =>
  request({ url: '/cdapi/customer/merge/customer', data, method: 'post' })

//获取crm客户姓名数据
export const getCustomerNames = (params) => request({ url: '/cdapi/surname/list', params })

//检查crm客户姓名数据
export const checkCustomerName = (params) =>
  request({ url: '/cdapi/surname/verification', params }, { withShowErrorMsg: false })

//添加客户
export const save = (data) =>
  request({
    url: '/cdapi/customer/save',
    data,
    method: 'post',
    headers: { contentType: 'application/json;charset=UTF-8' },
  })

//编辑客户
export const update = (data) =>
  request({
    url: '/cdapi/customer/update',
    data,
    method: 'post',
    headers: { contentType: 'application/json;charset=UTF-8' },
  })

//客户列表
export const getList = (params) =>
  request({ url: '/cdapi/customer/listPage', params }, { withShowErrorMsg: false })

//客户详情
export const getDetail = (params) => request({ url: '/cdapi/customer/info', params })

//获取用户所属经销商下的所以门店
export const getShopListByDeadler = (params) =>
  request({ url: '/cd-sys-web/v3/app/storeShoplist/byDeadler', params })

//获取用户所属门店下的员工
export const getStaffListByShop = (params) =>
  request(
    {
      url: '/cdapi/shop/userPositionShopList/shopIds',
      params,
    },
    { withShowErrorMsg: false }
  )

//获取用户所属门店下的员工
export const followPeopleChange = (params) =>
  request({
    url: '/cdapi/customer/updateFollowPeople',
    params,
    method: 'post',
  })

//添加方案给客户
export const addCustomerScheme = (data) =>
  request({ url: '/cdapi/customer/scheme/save', data, method: 'post' })

//删除客户的方案
export const delCustomerScheme = (data) =>
  request({ url: '/cdapi/customer/scheme/delete', data, method: 'post' })

//请求方案列表
export const getSchemeList = (params) =>
  request({ url: '/consumer-admin/api/kjlScheme/list', params })

//获取客户沟通记录列表
export const getFollowList = (params) =>
  request({ url: '/cdapi/customer/trackRecord/list', params })

//获取客户沟通记录详情
export const getFollowDetial = (params) =>
  request({ url: '/cdapi/customer/trackRecord/detail', params })

//更新客户沟通记录
export const updateFollowItem = (data) =>
  request({ url: '/cdapi/customer/trackRecord/saveOrUpdate', data, method: 'post' })

// 获取商机线索商品
export const getFollowGoodsList = (params) =>
  request({ url: '/cdapi/opportunityItem/list', params })
