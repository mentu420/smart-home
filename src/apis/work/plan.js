import { request } from '@/utils/request/'

// 获取
export const fetch = (params) => {
  return request({
    url: '/cd-sys-web/v3/app/workplan/workplandetail',
    params,
  })
}
// 添加
export const add = (data) =>
  request({ url: `/cd-sys-web/v3/app/workplan/save`, data, method: 'post' })

// 编辑
export const edit = (data) =>
  request({ url: `/cd-sys-web/v3/app/workplan/update`, data, method: 'post' })

//查询工作计划列表
export const fetchList = (params) =>
  request({ url: '/cd-sys-web/v3/app/workplan/workplanlist', params })
