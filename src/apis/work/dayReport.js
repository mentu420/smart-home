import { request } from '@/utils/request/'

//请求门店日报提交列表
export const getShopReportList = (params) => {
  return request({
    url: '/cd-sys-web/v3/app/boss/shop/dailynum',
    params,
  })
}

//获取经理门店
export const getManagerReportList = (params) =>
  request({ url: '/cd-sys-web/v3/app/shop/list/dailynum', params })

//跟进id日报评价列表
export const getAppraise = (params) =>
  request({ url: '/cd-sys-web/v3/app/daily/reviews/listbydailyId', params })

//保存点评
export const saveReport = (data) =>
  request({
    url: '/cd-sys-web/v3/app/daily/reviews/saveupdate',
    method: 'post',
    data,
    showLoading: true,
  })

// 保存日报
export const saveDayReport = (data) =>
  request({
    url: '/cd-sys-web/v3/app/daily/update',
    method: 'post',
    data,
    showLoading: true,
  })

//个人日报工作台
export const getWorkDesktop = (params) => request({ url: '/cd-sys-web/v3/app/daily', params })

//请求月员工日报
export const getMonthSummarize = (params) =>
  request({ url: '/cd-sys-web/v3/app/summarize/list', params })

//请求日员工日报
export const getDiarySummary = (params) => request({ url: '/cd-sys-web/v3/app/getdaily', params })
