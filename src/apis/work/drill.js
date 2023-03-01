import { request } from '@/utils/request/'

//请求符合门店列表
export const getShopList = (params) =>
  request({ url: '/dealermanage/app/shopExtend/getShops', params })

//请求门店数据列表
export const getDrillList = (data) =>
  request({ url: '/dealermanage/app/shopExtend/list', data, method: 'POST' })

//请求门店上传历史
export const getHistoryList = (params) =>
  request({ url: '/dealermanage/app/shopExtend/monthList', params })

//请求门店上传历史
export const getVideoList = (params) =>
  request({ url: '/dealermanage/app/shopExtend/getSubmit', params })

//请求门店信息
export const getShopDetial = (params) =>
  request({ url: '/dealermanage/app/shopExtend/getShop', params })

// 获取门店视频
export const getShopVideo = (params) =>
  request({ url: '/dealermanage/app/shopExtend/getSubmitOne', params })

// 删除门店视频
export const delectShopVideo = (params) =>
  request({ url: '/dealermanage/app/eventsubmitrecord/delete', params })

// 审批视频
export const submitVideoRemark = (params) =>
  request({ url: '/dealermanage/app/eventsubmitrecord/updateSubmit', params })

// 提交门店视频
export const submitShopVideo = (data) =>
  request({
    url: '/dealermanage/app/eventsubmitrecord/saveSubmit',
    data,
    method: 'POST',
  })

// 获取基础数据 城市、服务中心
export const getPatrolDatadictionary = (data) =>
  request({
    url: '/dealermanage/patrolDatadictionary/listpage',
    data,
    method: 'POST',
  })

// 报备申请
export const submitReport = (data) =>
  request({
    url: '/dealermanage/app/eventsubmitrecord/saveReport',
    data,
    method: 'POST',
  })

// 添加视频浏览记录
export const saveRecord = (data) =>
  request({
    url: '/dealermanage/eventqueryrecord/add',
    data,
    method: 'POST',
  })

// 更新报备
export const updateReport = (data) =>
  request({
    url: '/dealermanage/app/eventsubmitrecord/updateReport',
    data,
    method: 'POST',
  })

// 获取报备列表
export const getReportList = (params) =>
  request({
    url: '/dealermanage/app/eventresult/getReport',
    params,
  })
