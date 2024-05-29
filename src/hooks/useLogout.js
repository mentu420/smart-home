import { showToast } from 'vant'

import router from '@/router/'
import { removeStorage } from '@/utils/storage'
import { storeReset } from '@/store/utils'

export const cleanStore = () => {
  removeStorage('materialImages') // 网络对应本地资源图片路径缓存
  storeReset()
}

export const useLogout = async (message = '请重新登陆') => {
  cleanStore()
  showToast(message)
  router.replace({ path: '/account-login', replace: true })
}
