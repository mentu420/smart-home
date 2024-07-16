import { setUserConfig } from '@/apis/commonApi.js'
import userStore from '@/store/userStore'
import DeviceInfo from '@/utils/deviceInfo.js'

const useLogin = async (loginData) => {
  const { useSetToken } = userStore()
  const { data, code, des } = await setUserConfig(
    {
      params: { op: '0' },
      data: {
        shoujixinghao: DeviceInfo.platform,
        shoujimingcheng: DeviceInfo.platform,
        xitongleixing: DeviceInfo.system == 'ios' ? 1 : 2,
        dengluleixing: 2,
        tuisongtoken: 'tuisongtoken',
        ...loginData,
      },
    },
    { withToken: false }
  )
  if (code != 0) throw new Error(des)
  useSetToken(data)
}

export default useLogin
