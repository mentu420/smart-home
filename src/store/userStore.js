import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { getUserInfo, getDealerShopList } from '@/apis/common/user.js'
import { mergingStep } from '@/utils/common.js'
import { getStorage, removeStorage, setStorage } from '@/utils/storage.js'

export default defineStore('useUserStore', () => {
  // 统一token处理
  const { VITE_APP_STORAGE_TOKEN } = import.meta.env
  const useGetToken = () => getStorage(VITE_APP_STORAGE_TOKEN)
  const useSetToken = (value) => setStorage(VITE_APP_STORAGE_TOKEN, value)
  const useRemoveToken = () => removeStorage(VITE_APP_STORAGE_TOKEN)

  /**
   * 职位权限列表
   * 根据id判断功能权限
   * **/
  const userPowerList = ref([
    { id: 0, codes: ['Dealer Boss', 'Professional Manager'] }, //老板
    { id: 1, codes: ['Store Manager', 'Virtual Store Manager'] }, //店长
    { id: 2, codes: ['Sleep Consultant', 'KIS Test Position Type'] }, //导购
    { id: 3, codes: ['Marketing Supervisor'] }, //主管
    { id: 5, codes: ['Regional Manager', 'Market Manager'] }, //区域经理
  ])

  const userInfo = ref(null)
  const dealerList = ref(null)

  //判断用户权限，并存储之后使用
  const setPositionPower = (data) => {
    const { positionList, crmAccount, type } = data
    if (positionList.length == 0 && crmAccount == 0 && type == 1) {
      return { ...data, powers: [4] }
    }

    const powerList = positionList.map((item) => {
      const powerItem = userPowerList.value.find((powerItem) =>
        powerItem.codes.includes(item.positionType)
      )
      const power = powerItem ? powerItem.id : 4 // 如果存在则配置权限，否则默认为4
      return { ...item, power }
    })
    // 权限
    const powers = [...new Set(powerList.map((item) => item.power))]
    return { ...data, positionList: powerList, powers }
  }

  const setUserInfo = (palyload) => (userInfo.value = palyload)

  // 返回userInfo
  const useUserInfoSync = mergingStep(async (values = {}) => {
    const { reload = false } = values
    if (userInfo.value && !reload) return userInfo.value
    const tokenRes = useGetToken()
    if (!tokenRes) return {}
    const { code, data } = await getUserInfo({ virtualStore: 1, userId: tokenRes.id })
    if (code != 0) return {}

    setUserInfo(setPositionPower(data))
    return userInfo.value
  })

  // 获取当前职位权限
  const useUserPowerSync = async () => {
    const result = userInfo.value ? userInfo.value : await useUserInfoSync()
    return result.positionList.find((item) => item.crmId == result.primaryPositionId)?.power
  }

  /**
   * 返回经销商列表
   * @params {userId 必填,positionTypes,positionIds,positionStatus,shopStatus}
   * http://10.12.0.64/docs/v4_0_1/v4_0_1-1d2n03usp031v
   * **/
  const useDealerInfoSync = mergingStep(async (params) => {
    const { code, data } = await getDealerShopList({
      positionStatus: 1,
      ...params,
    })
    if (code != 0) return
    dealerList.value = data.map((dealer) => ({
      ...dealer,
      // dealerCode 经销商编码
      dealerCode: dealer.type === 'Dealer' ? dealer.shopNo : dealer.dealerNo,
    }))
    return dealerList.value
  })

  const useClearUserStore = () => {
    userInfo.value = null
    dealerList.value = null
    useRemoveToken()
  }

  return {
    userInfo,
    dealerList,
    userPowerList,
    setUserInfo,
    useUserInfoSync,
    useDealerInfoSync,
    useUserPowerSync,
    useGetToken,
    useSetToken,
    useRemoveToken,
    useClearUserStore,
  }
})
