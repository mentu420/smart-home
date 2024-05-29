import localforage from 'localforage'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { setUserConfig, getUserConfig } from '@/apis/commonApi.js'
import { mergingStep } from '@/utils/common.js'
import { getStorage, removeStorage, setStorage } from '@/utils/storage.js'

const storeName = 'userStore'

export default defineStore(storeName, () => {
  // 统一token处理
  const { VITE_APP_STORAGE_TOKEN } = import.meta.env
  const useGetToken = () => getStorage(VITE_APP_STORAGE_TOKEN)

  const userInfo = ref(null)
  const onLine = ref(useGetToken() ? true : false) // 记录是否在线

  const useSetToken = (value) => {
    onLine.value = true
    setStorage(VITE_APP_STORAGE_TOKEN, value)
  }
  const useRemoveToken = () => removeStorage(VITE_APP_STORAGE_TOKEN)

  const init = async () => {
    const storeRes = JSON.parse(await localforage.getItem(storeName))
    userInfo.value = storeRes?.userInfo
  }

  init()

  const setUserInfo = (palyload) => (userInfo.value = { ...userInfo.value, ...palyload })

  /**
   * @params {reload} //reload 是否重新获取用户信息
   * **/
  const useUserInfoSync = mergingStep(async (reload = false) => {
    if (userInfo.value && !reload) return userInfo.value
    const { data } = await getUserConfig({ params: { op: 1 }, options: { withToken: true } })
    userInfo.value = data
    return userInfo.value
  })

  const reset = () => {
    userInfo.value = null
    onLine.value = false
    useRemoveToken()
  }

  return {
    onLine,
    userInfo,
    setUserInfo,
    useUserInfoSync,
    useGetToken,
    useSetToken,
    useRemoveToken,
    reset,
  }
})
