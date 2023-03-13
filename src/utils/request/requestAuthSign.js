import md5 from 'js-md5'

import userStore from '@/store/userStore.js'

export function authSign(config) {
  const { useGetToken } = userStore()
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
