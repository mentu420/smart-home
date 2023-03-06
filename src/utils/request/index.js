import md5 from 'js-md5'

import userStore from '@/store/userStore.js'
import { getStorage } from '@/utils/storage.js'

import { authSign } from './requestAuthSign.js'
import useRequest from './useRequest'

export const request = async (axiosOptions = {}, customOptions = {}) => {
  const { method = 'get', headers, ...args } = axiosOptions

  const { withToken = false, withShowErrorMsg = true } = customOptions

  let config = { ...args, method, with_show_error_msg: withShowErrorMsg }

  const dataKey = { get: 'params', post: 'data' }[method.toLowerCase()]

  // 带token
  if (withToken) config = authSign(config)

  return useRequest(config)
}
