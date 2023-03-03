import md5 from 'js-md5'

import useUserStore from '@/store/userStore.js'
import { getStorage } from '@/utils/storage.js'

import { authSign } from './requestAuthSign.js'
import useRequest from './useRequest'

export const request = async (axiosOptions = {}, customOptions = {}) => {
  const { useUserInfoSync, useGetToken } = useUserStore()
  const { method = 'get', headers, ...args } = axiosOptions

  const {
    withUserId = false,
    withToken = false,
    withUserInfoFn = false,
    withShowErrorMsg = true,
    withParams = true,
  } = customOptions

  const { token, id } = useGetToken() || {}
  let config = { ...args, method, with_show_error_msg: withShowErrorMsg }

  const dataKey = { get: 'params', post: 'data' }[method.toLowerCase()]
  // 带userId
  if (withUserId) config = { ...config, [dataKey]: { ...config[dataKey], userId: id } }
  // 自定义用户信息
  if (withUserInfoFn) {
    config = {
      ...config,
      [dataKey]: { ...config[dataKey], ...withUserInfoFn(await useUserInfoSync()) },
    }
  }

  // 带token
  if (withToken) config = { ...config, headers: authSign(headers, token) }
  if (withParams) {
    config = {
      ...config,
      [dataKey]: {
        ...config[dataKey],
        appid: import.meta.env.VITE_APP_APP_NAME,
        shijianchuo: new Date().valueOf() + '',
        yanzheng: md5(
          import.meta.env.VITE_APP_APP_NAME +
            new Date().valueOf() +
            'upqvk54gneu0jwcnivlfhsr2efwoywey'
        ),
      },
    }
  }

  return useRequest(config)
}
