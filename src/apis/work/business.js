import { request } from '@/utils/request/'
// 获取列表
export const getList = (params) => request({ url: '/cdapi/opportunity/listPage', params })

// 获取商机详情
export const getBusinessDetail = (params) => request({ url: '/cdapi/opportunity/details', params })

//新增、编辑商机
export const updateBusinessItem = (data) =>
  request({
    url: '/cdapi/opportunity/saveOrUpdateOpportunityDetails',
    data,
    method: 'post',
  })

// 获取商机商品
export const getBusinessGoods = (params) => request({ url: '/cd-sys-web/v2/app/product', params })

// 品牌系列
export const getGoodsBrand = (params) => request({ url: '/dealermanage/brandseries/list', params })

// 关闭商机
export const addRecordItem = (data) =>
  request({ url: '/cdapi/trackrecord/save', data, method: 'post' })

// 关闭商机
export const closeBusiness = (data) =>
  request({
    url: '/cdapi/opportunityClose/saveOrUpdate',
    data,
    method: 'post',
  })

// 获取商机沟通记录
export const getRecordList = (params) => request({ url: '/cdapi/trackrecord/listPage', params })

// 获取商机关闭记录
export const getCloseList = (params) => request({ url: '/cdapi/opportunityClose/listPage', params })

// 获取商机分配列表
export const getAssignList = (params) =>
  request({ url: '/cdapi/opportunityFollow/listPage', params })

// 获取店员列表
export const getClerksList = (params) => request({ url: '/cdapi/app/shopUserList', params })

// 获取门店列表
export const updateFollowPerson = (data) =>
  request({
    url: '/cdapi/opportunity/updateFollowPerson',
    data,
    method: 'post',
  })

// 获取所属经销商下所有门店与店长
export const getShopWithBoss = (params) =>
  request({ url: '/cd-sys-web/v3/app/boss/shop/list', params })

// 检查客户
export const checkCustomer = (params) => request({ url: '/cdapi/customerInfo/listPage', params })

// 获取招商平台地理数据
export const getDealermanageRegion = (params) =>
  request({ url: '/dealermanage/datadictionary/list', params })

// 微信公众号信息推送
export const subscribeMessage = (data) =>
  request({
    url: '/consumer-admin/wx/mp/msg/template/send',
    data,
    method: 'post',
  })

// 请求商机配置选项
export const getConfigColumns = (params) =>
  request({ url: '/consumermanage/datadictionary/list', params })

// 商机申请退回
export const udpateBackItem = (data) =>
  request({ url: '/cdapi/opportunity/updateReturnType', data, method: 'post' })

// 商机申请退回列表
export const getBackList = (params) =>
  request({
    url: '/consumermanage/businesschancereturn/modelListpage',
    params,
  })

// 商机申请退回详情
export const getBackItem = (params) =>
  request({
    url: '/consumermanage/businesschancereturn/getReturnAudit',
    params,
  })

// 商机申请退回详情审核记录
export const getBackItemAudioList = (params) =>
  request({ url: '/consumermanage/businesschanceaudit/listAudit', params })

// 商机电销审核记录
export const getVerifyList = (params) =>
  request({ url: '/consumermanage/cluesconnectrecord/listpage', params })

// 获取飞鱼录音资源
export const recordFile = (data) => {
  return request({
    url: '/consumermanage/feishucallservice/recordFile',
    method: 'POST',
    data,
  })
}

// 话务录音文件
export const yeastarcallserviceRecordFile = async (params) => {
  return request({
    url: '/consumermanage/yeastarcallservice/install',
    method: 'POST',
    data: params,
  })
}

// 获取经销商员工列表
export const getStaffListByDealer = async (params) => {
  return request({
    url: '/cdapi/app/userList',
    params,
  })
}

// 获取商机统计数量
export const getBusinessQuantity = async (params) => {
  return request({
    url: '/cdapi/opportunity/countOpp',
    params,
  })
}

// 商机批量更换跟进人
export const updateFollowPersonBatch = async (data) => {
  return request({
    url: '/cdapi/opportunity/extendsFollowPerson',
    data,
    method: 'POST',
  })
}

//------------------下面是慕思助手专用接口------------------------------------------------

// 获取用户所在城市编码
export const getUserCityCode = (data) =>
  request({
    url: '/consumermanage/commonResponseConfig/getDomainsByEmployeeNo',
    data,
    method: 'post',
  })

// 获取用户所在城市编码获取经销商
export const getDealerWidthCode = (data) =>
  request({
    url: '/dealermanage/crmdistributor/getDistributorPageByAuthorizedCityCodeList',
    data,
    method: 'post',
  })

// 获取用户所在城市商机
export const getCityBusinessList = (data) =>
  request({
    url: '/consumermanage/businesschance/v2/getBusinessChanceList',
    data,
    method: 'post',
  })

// 获取用户所在城市商机详情
export const getCityBusinessItem = (params) =>
  request({
    url: '/consumermanage/businesschance/getBusinessChanceInfo',
    params,
  })

// 下发商机
export const updateCityBusiness = (data) =>
  request({
    url: '/consumermanage/businesschance/sendBusinessChance',
    data,
    method: 'post',
  })

// 获取经销商信息
export const getDealerShopInfo = (params) => request({ url: '/cdapi/shop/list', params })
