import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getDeviceList } from '@/apis/smartApi'
import { CLASSIFY_ICON, CLASSIFY_EXECL, TYPE_EXECL, TYPE_VALUE_EXECL } from '@/enums/deviceInfo'

export default defineStore('deviceStore', () => {
  const deviceList = ref([])

  // 获取设备图片
  const getDeviceIcon = (classify) => CLASSIFY_ICON[classify]

  //异步获取设备列表
  const useGetDeviceListSync = async (reload = false) => {
    if (deviceList.value.length > 0 && !reload) return deviceList.value
    const { data } = await getDeviceList({ op: 1 })
    deviceList.value = data.map((item) => {
      const columns = TYPE_VALUE_EXECL.filter((typeItem) => typeItem.category == item.daleixing)
      return {
        ...item,
        icon: getDeviceIcon(item.xiaoleixing.slice(0, 3)),
        columns,
        label: item.mingcheng,
        id: item.bianhao,
        rId: item.fangjianbianhao, //房间编号
      }
    })
    return deviceList.value
  }

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

  const deviceItem = computed({
    get: (id = '') => deviceList.value.find((deviceItem) => deviceItem.id == id),
    set: (val) => useDeviceItemChangeSync(val),
  })

  return {
    deviceList,
    getDeviceIcon,
    useGetDeviceListSync,
    useDeviceItemChangeSync,
    deviceItem,
  }
})
