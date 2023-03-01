import { request } from '@/utils/request/'

// 我的报名列表
export const getEnrollList = (params) => request({ url: `/cdapi/apply/enroll`, params })

//申请退款
export const applyRefund = (params) => request({ url: `/cdapi/apply/refundflag`, params })

// 获取订单信息
export const getOrderInfo = (params) => request({ url: `/cdapi/apply/enroll/detail`, params })

// 修改订单信息
export const editOrderMsg = (params) =>
  request({
    url: `/cdapi/apply/information/update`,
    params,
    headers: { 'Content-Type': 'application/json' },
  })

// 报名模块
// 获取报名列表
export const getTrainList = (params) => request({ url: `/cdapi/apply/list`, params })

// 获取报名详情
export const getTrainDetail = (params) => request({ url: `/cdapi/apply/information`, params })

// 调用支付
export const wechatPay = (data) =>
  request({
    url: '/cdapi/apply/pay',
    method: 'post',
    data,
    showLoading: true,
  })

// 取消支付
export const cancelPay = (params) => request({ url: `/cdapi/apply/pay/cancel`, params })

// 提交报名
export const postTrainData = (data) =>
  request({
    url: `/cdapi/apply/apply`,
    method: 'post',
    data,
    showLoading: true,
  })

// 支付成功记录
export const successPay = (params) => request({ url: `/cdapi/apply/order/update`, params })

// 获取订单状态
export const getOrderStatus = (params) => request({ url: `/cdapi/apply/order/status`, params })

// 获取订单状态
export const getWriteoffList = (params) =>
  request({ url: `/consumer-admin/v1/api/liveorder/writeoff`, params })

export const getCardWriteoffList = (params) =>
  request({
    url: '/cd-sys-web/goodsWriteOffMember/list',
    params,
  })
