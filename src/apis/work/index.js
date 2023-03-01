import { request } from '@/utils/request/'

//获取门店数据看板
export const getShopReportForms = (params) =>
  request({ url: '/cd-sys-web/v3/app/workbench/shop', params })

//获取员工数据看板
export const getStaffReportForms = (params) =>
  request({ url: '/cd-sys-web/v3/app/workbench', params })

//获取经销商老板数据统计
export const getStatisticsByDeal = (params) =>
  request({ url: '/cd-sys-web/v3/app/workbench/boss', params })

//根据职位获取数据统计
export const getStatisticsByPost = (params) =>
  request({ url: '/cd-sys-web/v3/app/workbench/userPosition', params })

//反馈获取总部是否回复
export const checkFeedbackReply = (editUserId) =>
  request({
    headers: { 'Cache-Control': 'no-cache' },
    url: `/consumermanage/appessay/terminalFeedbackCheckIsNotView/${editUserId}`,
    params: {
      timestamp: +new Date(),
    },
  })

//获取商城门店客户列表
export const getShopCustomerList = (params) =>
  request({ url: '/member/memberinfo/listpage', params })

//获取市场抽查反馈列表
export const getEssayList = (params) => request({ url: '/consumermanage/essay/listpage', params })

// 新增市场抽查反馈
export const addEssayItem = (data) =>
  request({ url: '/consumermanage/essay/add', data, method: 'post' })

// 获取市场抽查项详情
export const getEssayItem = (id) => request({ url: '/consumermanage/essay/getById/' + id })
