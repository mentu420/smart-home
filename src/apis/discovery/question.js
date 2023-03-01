import { request } from '@/utils/request/'

// 获取目录
export const getParentMemu = (params) => {
  return request({
    url: `/consumer-admin/api/question/repository/v2/problem`,
    params,
  })
}
// 获取热门列表
export const getHotList = (params) => {
  return request({
    url: `/consumer-admin/api/question/repository/v2/list`,
    params,
  })
}
// 收藏
export const collectQuestion = (params) => {
  return request({
    url: `/consumer-admin/api/question/repository/v2/collection`,
    params,
  })
}
// 取消收藏
export const cancelCollectQuestion = (params) => {
  return request({
    url: `/consumer-admin/api/question/repository/v2/cancelCollection`,
    params,
  })
}
// 二级分类列表
export const childrenList = (params) => {
  return request({
    url: `/consumer-admin/api/question/repository/v2/stage`,
    params,
  })
}
