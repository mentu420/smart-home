import { showToast } from 'vant'

import router from '@/router/'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'
import userStore from '@/store/userStore'
import { removeStorage } from '@/utils/storage'

export const storeReset = () => {
  removeStorage('materialImages') // 网络对应本地资源图片路径缓存
  houseStore().reset()
  smartStore().reset()
  deviceStore().reset()
  const useUserStore = userStore()
  useUserStore.useRemoveToken()
  useUserStore.reset()
}

export const useLogout = async (message = '请重新登陆') => {
  storeReset()
  showToast(message)
  router.replace({ path: '/account-login', replace: true })
}
