import { showToast } from 'vant'

import useMqtt from '@/hooks/useMqtt'
import router from '@/router/'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'
import userStore from '@/store/userStore'
import materialStore from '@/store/materialStore'

const { mqttDisconnect } = useMqtt()

export const storeReset = () => {
  houseStore().reset()
  smartStore().reset()
  deviceStore().reset()
  const useUserStore = userStore()
  useUserStore.useRemoveToken()
  useUserStore.reset()
}

export const useLogout = async (message = '请重新登陆') => {
  storeReset()
  mqttDisconnect()
  showToast(message)
  router.replace({ path: '/account-login', replace: true })
}
