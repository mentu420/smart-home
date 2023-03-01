import { request } from '@/utils/request/'

//请求直播列表
export const getLiveList = (params) => {
  return request({
    url: '/cdapi/live/list',
    params,
  })
}

//请求直播详情
export const getLiveDetail = (params) => {
  return request({
    url: '/cdapi/live/detail',
    params,
  })
}

//请求客户列表
export const getCustomers = (params) => {
  return request({
    url: '/cdapi/live/getConsumer',
    params,
  })
}

//请求订单列表/详情
export const getOrders = (params) => {
  return request({
    url: '/cdapi/live/userorder',
    params,
  })
}

//--------------------营销活动--------------------------------

//请求营销活动列表
export const getActivityList = (params) => {
  return request({
    url: '/consumer-admin/api/cm/activity/list',
    params,
  })
}
//请求营销活动详情
export const getActivityDetail = (params) => {
  return request({
    url: `/consumer-admin/api/cm/activity/info/${params}`,
    method: 'get',
  })
}

//--------------------裂变--------------------------------

//请求裂变活动列表
export const getVariationList = (params) => {
  return request({
    url: '/cdapi/live/activity/list',
    params,
  })
}
//请求裂变活动详情
export const getVariationDetail = (params) => {
  return request({
    url: `/cdapi/live/activity/info`,
    params,
  })
}

//--------------------kpi--------------------------------
//请求kpi详情
export const getKpiDetail = (params) => {
  return request({
    url: '/cdapi/activitykpi/kpidetail',
    params,
  })
}
//请求kpi阶段任务
export const getKpiTast = (params) => {
  return request({
    url: '/cdapi/activitykpi/taskdetail',
    params,
  })
}
//请求个人排行榜
export const getPresonalSort = (params) => {
  return request({
    url: '/cdapi/activitykpi/personalleaderboard',
    params,
  })
}
//搜索个人排行榜
export const searchPresonalSort = (params) => {
  return request({
    url: '/cdapi/activitykpi/personalleaderboardtosearch',
    params,
  })
}

//业绩列表
export const getAchieveList = (params) => {
  return request({
    url: '/cdapi/live/performance/achievement',
    params,
  })
}
//海报裂变
export const getPostersList = (params) => {
  return request({
    url: '/cdapi/live/performance/posterslist',
    params,
  })
}
//浏览、助力业绩
export const getBrowseList = (params) => {
  return request({
    url: '/cdapi/live/performance/browselist',
    params,
  })
}
//直播预约业绩
export const getForwardList = (params) => {
  return request({
    url: '/cdapi/live/performance/forwardlist',
    params,
  })
}
//邀约业绩
export const getInviteList = (params) => {
  return request({
    url: '/cdapi/live/performance/invitelist',
    params,
  })
}
// //资产明细
export const getPropertyDetail = (params) => {
  return request({
    url: '/cdapi/live/performance/detail',
    params,
  })
}
//提现
export const takeMoney = (params) => {
  return request({
    url: '/cdapi/live/performance/save',
    params,
  })
}
