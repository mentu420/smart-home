import { showToast } from 'vant'

import router from '@/router/'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import sceneStore from '@/store/sceneStore'
import userStore from '@/store/userStore'

export const storeReset = () => {
  houseStore().reset()
  sceneStore().reset()
  deviceStore().reset()
  const useUserStore = userStore()
  useUserStore.useRemoveToken()
  useUserStore.reset()
}

export const useLogout = async (message = '请重新登陆') => {
  storeReset()
  showToast(message)
  router.push({ path: '/accountLogin' })
}
