import { request } from '@/utils/request/'

//请求方案列表
export const getList = (params) => request({ url: '/consumer-admin/api/kjlScheme/list', params })

//请求方案详情
export const getDetail = (params) => {
  return request({
    url: '/cdapi/kjlScheme/schemedetails',
    params,
  })
}
//请求方案清单
export const getRoomProductList = (params) => {
  return request({
    url: '/cdapi/kjlRoom/roomlist',
    params,
  })
}
//请求多个方案清单
export const getSchemeProductList = (params) => {
  return request({
    url: '/cdapi/kjlProduct/goods/list',
    params,
    repeat: false,
  })
}
//请求房间详情
export const getRoomDetail = (params) => {
  return request({
    url: '/cdapi/kjlRoom/roomdetails',
    params,
  })
}
//获取户型数据
export const getApartmentData = () => {
  return request({
    url: '/cd-sys-web/v2/app/reference',
    params: {
      type: 'KJL_APARTMENT_TYPE',
    },
  })
}
//获取地址数据
export const getAreaDate = (params) => {
  return request({
    url: '/cd-sys-web/v1/api/public/address',
    params,
  })
}
//意向添加3D方案
export const addIntentionScheme = (params) => {
  return request({
    url: '/cd-sys-web/v3/app/opportunity/savescheme',
    method: 'post',
    data: params,
  })
}
//意向删除3D方案
export const delIntentionScheme = (params) => {
  return request({
    url: '/cd-sys-web/v3/app/opportunity/deletescheme',
    method: 'post',
    data: params,
  })
}

//查询报单列表
export const getFormList = (params) => {
  return request({
    url: '/cdapi/kjl/declarationform/list',
    params,
  })
}
//查询报单详情
export const getFormDetail = (params) => {
  return request({
    url: '/cdapi/kjl/declarationform/getdetails',
    params,
  })
}
//添加报单
export const addForm = (params) => {
  return request({
    url: '/cdapi/kjl/declarationform/save',
    method: 'post',
    data: params,
  })
}

//添加报单
export const getStyleTags = () => request({ url: '/consumer-admin/api/kjlScheme/tag/list' })
