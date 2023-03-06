import { getAuthToken } from '@/apis/common/user.js'
import useUserStore from '@/store/userStore.js'

import { againRequest } from './requestAgainSend.js' // 请求重发
import { authSign } from './requestAuthSign.js'

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let retryRequests = []
// Map对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。
const pendingRequest = new Map()

export const refreshToken = async () => {
  const { useGetToken, useSetToken } = useUserStore()
  let tokenRes = useGetToken()
  const { data } = await getAuthToken({ userId: tokenRes.id })
  if (data) useSetToken(data)
  return data
}

export const refreshTokenRequest = async (response, useRequest) => {
  let config = response.config
  if (!isRefreshing) {
    isRefreshing = true
    return refreshToken()
      .then((tokenRes) => {
        // 已经刷新了token，将所有队列中的请求进行重试
        retryRequests.forEach((cb) => cb(tokenRes.token))
        // 重试完清空这个队列
        retryRequests = []
        config = authSign(config)
        return useRequest(config)
      })
      .catch(() => {
        //TODO: logout
      })
      .finally(() => {
        isRefreshing = false
      })
  } else {
    // 正在刷新token，返回一个未执行resolve的promise
    return new Promise((resolve) => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      retryRequests.push((token) => {
        config = authSign(config)
        resolve(againRequest({ ...response, config }, useRequest))
      })
    })
  }
}
