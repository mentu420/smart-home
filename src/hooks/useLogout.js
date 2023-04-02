import { showToast } from 'vant'

import router from '@/router/'
import houseStore from '@/store/houseStore'
import sceneStore from '@/store/sceneStore'
import userStore from '@/store/userStore'

export const useLogout = async (message = '请重新登陆') => {
  const useHouseStore = houseStore()
  const useSceneStore = sceneStore()
  const useUserStore = userStore()
  useUserStore.useRemoveToken()
  useUserStore.$reset()
  useHouseStore.$reset()
  useSceneStore.$reset()
  showToast(message)
  router.push({ path: '/accountLogin' })
}
