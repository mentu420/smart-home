import { request } from '@/utils/request/'
//post
export const post = (data) =>
  request({
    url: '/cd-sys-web/train/pointsGain/api/gain',
    data,
    method: 'post',
  })

//get
export const get = (params) =>
  request({
    url: '/cd-sys-web/train/pointsGain/api/gain',
    params,
  })

//统计会员信息
export const memberInfoStatistics = (params) =>
  request({
    url: '/member/app/memberinfo/memberInfoStatistics',
    // method: "get",
    params,
  })

//会员列表
export const listpage = (params) =>
  request({
    url: '/member/memberinfo/listpage',
    params,
  })

//查询用户
export const selectuserinfo = (data) =>
  request({
    url: '/member/wechatlogin/selectuserinfo',
    data,
    method: 'post',
  })

//非积分订单列
export const nopointorderListPage = (params) =>
  request({
    url: '/member/deliveryorder/nopointorderListPage',
    params,
  })

//优惠券列表
export const couponList = (params) =>
  request({
    url: '/member/memberproject/couponList',
    params,
  })

//我的积分
export const listAllRecords = (params) =>
  request({
    url: '/member/memberpointinfo/listAllRecords',
    params,
  })

//根据经销商列表获取用户id
export const shopUserList = (params) =>
  request({
    url: '/cdapi/app/shopUserList',
    params,
  })
