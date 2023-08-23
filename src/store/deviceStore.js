import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getDeviceList } from '@/apis/smartApi'
import { CLASSIFY_ICON, CLASSIFY_EXECL, TYPE_EXECL, TYPE_VALUE_EXECL } from '@/enums/deviceInfo'

export default defineStore('deviceStore', () => {
  const deviceList = ref([])

  const getDeviceIcon = (classify) => CLASSIFY_ICON[classify]

  const useGetDeviceListSync = async (reload = false) => {
    if (deviceList.value.length > 0 && !reload) return deviceList.value
    const { data } = await getDeviceList({ op: 1 })
    console.log(data)
    deviceList.value = data.map((item) => {
      // const classifyItem = [].find((deviceItem) => deviceItem.classify == item.daleixing)
      // const typeList = TYPE_EXECL.find((typeItem) => typeItem.category == item.daleixing)
      const columns = TYPE_VALUE_EXECL.filter((typeItem) => typeItem.category == item.daleixing)
      return {
        ...item,
        icon: getDeviceIcon(item.xiaoleixing.slice(0, 3)),
        columns,
        label: item.mingcheng,
        id: item.bianhao,
      }
    })
    return deviceList.value
  }

  const reset = () => {
    deviceList.value = []
  }

  return { deviceList, getDeviceIcon, reset, useGetDeviceListSync }
})
