import { request } from '@/utils/request/'

//所有广告审核
export const getAdvertVerify = (params) =>
  request({ url: '/cd-sys-web/adv/api/activitylist', params })

//广告审核商场列表
export const getAdvertVerifyList = (params) =>
  request({ url: '/cd-sys-web/adv/api/mallList', params })

//广告审核活动标准
export const getAdvertVerifyUpload = (params) =>
  request({ url: '/cd-sys-web/adv/api/standardList', params })

//广告审核活动标准
export const getRecordDetail = (params) =>
  request({ url: '/cd-sys-web/adv/api/getRecordDetail', params })

//广告审核已经上传的数据
export const getAdvertRecordItem = (data) =>
  request({
    url: '/cd-sys-web/adv/api/getRecordList',
    data,
    method: 'post',
    withLoading: true,
  })

//广告审核图片保存
export const saveAdvertImage = (data) =>
  request({
    url: '/cd-sys-web/adv/api/saveRecord',
    data,
    method: 'post',
  })

//广告审核图片提交
export const submitAdvertImage = (data) =>
  request({
    url: '/cd-sys-web/adv/api/submitRecord',
    data,
    method: 'post',
  })

// 爆品上样图片提交
export const submitAdvertSample = (data) =>
  request({
    url: '/cd-sys-web/adv/api/submitSellGoodsRecord',
    data,
    method: 'post',
  })

//爆品上样活动标准
export const getAdvertSampleUpload = (params) =>
  request({ url: '/cd-sys-web/adv/api/standardListByActivityId', params })
