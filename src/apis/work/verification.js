import { request } from '@/utils/request/'

//请求核销
export const writeOff = (params) => {
  return request({
    url: '/cd-sys-web/v1/api/writeofforder/writeoff',
    method: 'post',
    data: params,
  })
}

//请求核销详情
export const getDetail = (params) => {
  return request({
    url: '/cd-sys-web/v1/api/writeofforder/list',
    params,
  })
}
//请求核销详情
export const getCardDetail = (params) => {
  return request({
    url: '/cd-sys-web/goodsWriteOffMember/cardRoll',
    params,
  })
}
//核销卡卷
export const writeOffCard = (data) => {
  return request({
    url: '/cd-sys-web/goodsWriteOffMember/save',
    data,
    method: 'post',
  })
}
