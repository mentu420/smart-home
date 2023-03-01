import userStore from '@/store/userStore.js'
import { request } from '@/utils/request/'

const { useGetToken } = userStore()

//获取参考系
export const getReferenceOptions = (params) =>
  request({ url: '/cd-sys-web/v2/app/reference', params })

/**
 * 流量跟踪
 */
export const appFlow = async (mainActivityCode, modular, modularId, title) => {
  const { id } = useGetToken()
  const params = {
    platform: 102,
    modularType: 10,
    mainActivityCode: mainActivityCode || 0,
    modular: modular || 0,
    modularId: modularId || 0,
    type: '浏览',
    title: title || 0,
    userId: id,
  }
  return request({ url: '/consumer-admin/v1/api/visitrecord/add', params })
}
// 获取版本更新列表
export const getAppVersion = (params) => {
  return request({ url: '/consumer-admin/api/appEditionLog/list', params })
}
/**
 * 上传视频或图片
 * @param {*} params
 */
export const uploadFiles = (data) =>
  request({
    url: '/cdapi/upload/file',
    data,
    headers: { contentType: 'multipart/form-data' },
    method: 'post',
  })

//上传多个文件
export const postFiles = (data) =>
  request({
    url: '/cdapi/upload/files',
    data,
    headers: { contentType: 'multipart/form-data' },
    method: 'post',
  })

//上传多个文件
export const compressFiles = (data) =>
  request({
    url: '/cdapi/compress/upload/files',
    data,
    headers: { contentType: 'multipart/form-data' },
    method: 'post',
  })

// 发送验证码
export const sendSms = (data) => {
  return request({
    url: '/consumer-admin-sms/consumermanage/sms/send',
    data,
    method: 'POST',
  })
}

// 校验验证码
export const validatorSmsCode = (data) => {
  return request({
    url: '/consumer-admin-sms/consumermanage/sms/verifySnsCode',
    data,
    method: 'POST',
  })
}

//查询运营平台设置的键值对
export const getValueByKey = (params) =>
  request({
    url: '/consumer-admin/sys/config/getValueByKey',
    params,
  })

export const getWxWorkPayParams = (params) =>
  request({
    url: '/user/wxpay/jsapi',
    method: 'post',
    params,
    headers: { contentType: 'application/x-www-form-urlencoded' },
  })

//企业微信获取授权
export const getWXWorkTicket = (params) =>
  request({
    url: '/consumer-admin/api/wxwork/getTicketAndSignature',
    params,
  })

//获取wx jssdk config
export const getWXTicket = (params) => request({ url: '/consumer-admin/api/wx/getTicket', params })

//获取企业微信权限
export const getTicketAndSignature = (params) => {
  return request({
    url: 'https://derucci.net/api/wxwork/getTicketAndSignature',
    method: 'get',
    params,
  })
}
