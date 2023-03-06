import md5 from 'js-md5'

import useUserStore from '@/store/userStore.js'
import { getStorage } from '@/utils/storage.js'

import { authSign } from './requestAuthSign.js'
import useRequest from './useRequest'

export const request = async (axiosOptions = {}, customOptions = {}) => {
  const { useGetToken } = useUserStore()
  const { method = 'get', headers, ...args } = axiosOptions

  const { withToken = false, withShowErrorMsg = true } = customOptions

  let config = { ...args, method, with_show_error_msg: withShowErrorMsg }

  const dataKey = { get: 'params', post: 'data' }[method.toLowerCase()]

  // 带token
  if (withToken) {
    const { token } = useGetToken() || {}
    // 带固定参数
    config = {
      ...config,
      headers: { ...config.headers, Authorization: token },
      params: {
        ...config.params,
        appid: import.meta.env.VITE_APP_APP_ID,
        shijianchuo: new Date().valueOf() + '',
        yanzheng: md5(
          import.meta.env.VITE_APP_APP_ID +
            new Date().valueOf() +
            import.meta.env.VITE_APP_REQUEST_SIGN
        ),
      },
    }
  }

  return useRequest(config)
}
