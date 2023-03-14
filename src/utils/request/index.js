import { authSign, authToken } from './requestAuthSign.js'
import useAxios from './useAxios'

export const request = async (axiosOptions = {}) => {
  const { withShowErrorMsg = true, withToken = true, withParams = true, ...args } = axiosOptions

  let config = { ...args, withShowErrorMsg, withToken, withParams }

  // 带固定参数
  if (withParams) config = authSign(config)
  // 带token
  if (withToken) config = authToken(config)

  return useAxios(config)
}
