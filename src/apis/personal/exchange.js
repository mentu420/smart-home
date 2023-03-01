import { request } from '@/utils/request/'

//存储用户获取积分事件
export const saveExchangeSign = (data) =>
  request({
    url: '/cd-sys-web/train/pointsGain/api/gain',
    data,
    method: 'post',
  })

//获取积分事件记录
/**
 * integralTypeId 积分类型ID
 * activityId 活动ID
 * behaviorId 行为ID
 * sourceChannel 平台/渠道 1010
 * userId 用户唯一标识
 * activityName 活动名称
 * **/
export const getExchangeLastSign = (params) => request({ url: '/marketing/record/getlist', params })

//获取积分签到与否
export const getExchangeWidthSign = (data) =>
  request({
    url: '/marketing/eventrecord/checkEventRecord',
    data,
    method: 'post',
  })

//获取积分记录明细
export const getExchangeRecordDetail = (params) =>
  request({ url: '/marketing/record/listpage', params })

//获取积分商品列表
export const getExchangeGoods = (params) =>
  request({ url: '/marketing/commonactivitycommodity/listpage', params })

//获取积分商品详情
export const getExchangeGoodDetail = (id) =>
  request({ url: `/marketing/commonactivitycommodity/detail/${id}` })

//获取积分事件记录
export const getExchangeSignRecord = (params) =>
  request({ url: '/cd-sys-web/train/pointsGain/api/history', params })

//获取积分排序
export const getExchangeIntegralSort = (params) =>
  request({ url: '/cd-sys-web/train/pointsGain/api/integralTop', params })

//兑换积分商品
export const updateExchangeGoods = (data) =>
  request({ url: '/cd-sys-web/train/order/api/redeem', data, method: 'post' })

//获取兑换商品订单列表
export const getExchangeOrderList = (params, options) =>
  request({ url: '/cd-sys-web/train/order/api/orders', params }, options)

//获取兑换商品订单列表
export const editReceiveAddress = (data) =>
  request({
    url: '/cd-sys-web/train/order/api/modifyReceiveInfo',
    data,
    method: 'post',
  })

//获取兑换商品订单列表
export const receiveSucc = (data) =>
  request({
    url: '/cd-sys-web/train/order/api/confirmReceived',
    data,
    method: 'post',
  })
