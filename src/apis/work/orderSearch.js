import { request } from '@/utils/request/'

//请求订单列表
export const getList = (params) => request({ url: '/cd-sys-web/v3/app/order/list', params })

//获取订单详情
export const getOrderDetails = (orderId) =>
  request({ url: '/cd-sys-web/v3/app/order', params: { orderId: orderId } })
