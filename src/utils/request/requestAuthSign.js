import md5 from 'js-md5'

import userStore from '@/store/userStore.js'

export function authSign(config) {
  // 带固定参数
  const timespan = new Date().valueOf() + ''
  return {
    ...config,
    params: {
      ...config.params,
      appid: import.meta.env.VITE_APP_APP_ID,
      timespan,
      sign: md5(import.meta.env.VITE_APP_APP_ID + timespan + import.meta.env.VITE_APP_REQUEST_SIGN),
    },
  }
}

export const authToken = (config) => {
  const { useGetToken } = userStore()
  const token = useGetToken() || {}
  return { ...config, headers: { ...config.headers, Authorization: token } }
}
