import { request } from '@/utils/request/'

export const getClassification = (params) =>
  request({ url: '/consumermanage/classification/list', params })

export const getList = (params) =>
  request({ url: '/consumermanage/appessay/listFromMobile', params })

export const updateEssayStatus = (data) =>
  request({ url: '/consumermanage/essay/updateEssayStatus', data, method: 'post' })

export const updateEssay = (data) =>
  request({ url: '/consumermanage/essay/update', data, method: 'post' })

export const addEssay = (data) =>
  request({ url: '/consumermanage/appessay/add', data, method: 'post' })

export const getEssayById = (params) =>
  request({
    url: `/consumermanage/essay/getById/${params.id}`,
    params: { editUserId: params.editUserId },
  })

export const TransmitEssay = (data) =>
  request({ url: '/consumermanage/essay/assign', data, method: 'post' })

export const updateShopViewFlag = (params) =>
  request({ url: `/consumermanage/appessay/terminalRecordShopViewFlag/${params.id}` })

export const getUserTree = (params) => {
  return request(
    {
      url: '/consumer-admin/sys/user/userTree',
      method: 'get',
      params,
    },
    { withShowErrorMsg: false }
  )
}

export const getUserListTotal = (params) => {
  return request(
    {
      url: '/consumer-admin/sys/user/listTotal',
      method: 'get',
      params,
    },
    { withShowErrorMsg: false }
  )
}
