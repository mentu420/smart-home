import md5 from 'blueimp-md5'
import qs from 'qs'

export let getSign = (obj) => {
  const str = qs.stringify(obj)
  return md5(str).toUpperCase()
}

const getHeader = () => {
  return {
    api_client_code: import.meta.env.VITE_APP_CLIENT_CODE,
    api_version: import.meta.env.VITE_APP_API_VERSION,
    api_timestamp: (+new Date()).toString(),
  }
}

export function authSign(headers, token) {
  headers = {
    ...getHeader(),
    ...headers,
  }
  let signObj = {
    api_client_code: headers.api_client_code,
    api_version: headers.api_version,
    api_timestamp: headers.api_timestamp,
  }
  if (token) {
    headers.api_token = token
    signObj = {
      api_token: token,
      ...signObj,
    }
  }
  headers.api_sign = getSign(signObj)

  return headers
}
