import axios, { isCancel } from 'axios' // 此处引入axios官方文件
import { showNotify } from 'vant'

import useUserStore from '@/store/userStore.js'

import { againRequest } from './requestAgainSend.js' // 请求重发
import {
  requestInterceptor as cacheReqInterceptor,
  responseInterceptor as cacheResInterceptor,
} from './requestCache.js'
import { addPendingRequest, removePendingRequest } from './requestCancelRepeat.js' // 取消重复请求
// import { refreshTokenRequest } from './requestRefreshToken.js'

const useAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json;charset=UTF-8',
  },
  retry: 2, //retry 请求重试次数
})

// 返回结果处理
// 自定义约定接口返回{code: xxx, data: xxx, msg:'err message'}
const responseHandle = (response) => {
  const { useRemoveToken } = useUserStore()
  if ([101, 102].includes(response.data.code)) {
    // TODO:刷新token
  } else if ([10001, 10003].includes(response.data.code)) {
    useRemoveToken()
    //'账号异常，强制退出'
  } else if (response.config.__retryCount === 2 && response.data.code != 0) {
    if (response.config.withShowErrorMsg)
      showNotify({ type: 'danger', message: response.data.des || '网络请求超时，请稍后重试！' })
  } else {
    return againRequest(response, useAxios)
  }
  return response.data || response
}

// 添加请求拦截器
useAxios.interceptors.request.use(
  (config) => {
    console.log(config)
    // pendding 中的请求，后续请求不发送（由于存放的peddingMap 的key 和参数有关，所以放在参数处理之后）
    addPendingRequest(config) // 把当前请求信息添加到pendingRequest对象中
    //  请求缓存
    cacheReqInterceptor(config, useAxios)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
useAxios.interceptors.response.use(
  (response) => {
    // 响应正常时候就从pendingRequest对象中移除请求
    removePendingRequest(response)
    cacheResInterceptor(response)
    return responseHandle(response)
  },
  (error) => {
    if (error.config.__retryCount === 2) {
      if (error.code === 'ECONNABORTED')
        showNotify({ type: 'danger', message: '网络请求超时，请稍后重试！' })
      if (error.code === 'ERR_NETWORK')
        showNotify({ type: 'danger', message: '网络请求失败，请稍后重试！' })
    }
    // 从pending 列表中移除请求
    removePendingRequest(error.config || {})
    // 需要特殊处理请求被取消的情况
    if (!isCancel(error)) {
      // 请求重发
      return againRequest(error, useAxios)
    }
    // 请求缓存处理方式
    if (isCancel(error) && error.message.data && error.message.data.config.cache) {
      return Promise.resolve(error.message.data.data.data) // 返回结果数据
    }

    return Promise.reject(error)
  }
)

export default useAxios
