import localforage from 'localforage'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getDeviceList } from '@/apis/smartApi'
import { CLASSIFY_ICON, CLASSIFY_EXECL, TYPE_EXECL, TYPE_VALUE_EXECL } from '@/enums/deviceInfo'

const storeName = 'deviceStore'

export default defineStore(storeName, () => {
  const deviceList = ref([])

  const init = async () => {
    const storeRes = JSON.parse(await localforage.getItem(storeName))
    deviceList.value = storeRes?.deviceList
  }

  init()

  // 获取设备图片
  const getDeviceIcon = (classify) => CLASSIFY_ICON[classify]

  //异步获取设备列表
  const useGetDeviceListSync = async (reload = false) => {
    if (deviceList.value.length > 0 && !reload) return deviceList.value
    const { data } = await getDeviceList({ op: 1 })
    deviceList.value = data.map((item) => {
      const columns = TYPE_VALUE_EXECL.filter((typeItem) => typeItem.category == item.xiaoleixing)
      return {
        ...item,
        icon: getDeviceIcon(item.xiaoleixing.slice(0, 3)),
        columns,
        label: item.mingcheng,
        id: item.bianhao,
        rId: item.fangjianbianhao, //房间编号
        classify: item.daleixing,
      }
    })
    return deviceList.value
  }

  const useDeviceItemSync = async (id) => {
    return deviceList.value.find((item) => item.id == id)
  }

  const deviceUseList = computed(() => (id) => {
    return deviceList.value.find((item) => item.id == id)?.columns?.map((item) => item.use)
  })

  // 异步变更单设备数据
  const useDeviceItemChangeSync = async (payload) => {
    console.log('useSetDeviceItemSync', payload)
    deviceList.value = deviceList.value.map((deviceItem) => {
      if (deviceItem.id == payload.id) {
        return { ...deviceItem, ...payload }
      }
      return deviceItem
    })
  }

  const reset = () => {
    deviceList.value = []
  }

  return {
    deviceList,
    deviceUseList,
    getDeviceIcon,
    useGetDeviceListSync,
    useDeviceItemChangeSync,
    useDeviceItemSync,
    reset,
  }
})
