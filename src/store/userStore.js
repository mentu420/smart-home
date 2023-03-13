import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

// import { getUserInfo } from '@/apis/userApi.js'
import { mergingStep } from '@/utils/common.js'
import { getStorage, removeStorage, setStorage } from '@/utils/storage.js'

export default defineStore('useUserStore', () => {
  // 统一token处理
  const { VITE_APP_STORAGE_TOKEN } = import.meta.env
  const useGetToken = () => getStorage(VITE_APP_STORAGE_TOKEN)
  const useSetToken = (value) => setStorage(VITE_APP_STORAGE_TOKEN, value)
  const useRemoveToken = () => removeStorage(VITE_APP_STORAGE_TOKEN)

  const userInfo = ref(null)
  const dealerList = ref(null)

  const setUserInfo = (palyload) => (userInfo.value = palyload)

  // 返回userInfo
  const useUserInfoSync = mergingStep(async (values = {}) => {
    return userInfo.value
  })

  const useClearUserStore = () => {
    userInfo.value = null
    dealerList.value = null
    useRemoveToken()
  }

  return {
    userInfo,
    dealerList,
    setUserInfo,
    useUserInfoSync,
    useGetToken,
    useSetToken,
    useRemoveToken,
    useClearUserStore,
  }
})
