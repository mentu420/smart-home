import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getDeviceList } from '@/apis/smartApi'
import DEVICE_INFO from '@/enums/deviceInfo'

export default defineStore('deviceStore', () => {
  const deviceList = ref([])

  /**
   * @params
   * value  设备大类或者小类
   * key 大类classify 小类category
   * **/
  const getDeviceTypeItem = computed(() => (value, key = 'classify') => {
    return (
      DEVICE_INFO.find((deviceItem) => {
        if (key == 'classify') return deviceItem[key] == value
        return deviceItem[key].includes(value)
      }) || {
        icon: 'tips',
        name: '未知设备',
        classify: '000',
        category: [],
      }
    )
  })

  const initDevice = async () => {
    const { data } = await getDeviceList({ op: 1 })
    deviceList.value = data
  }

  const reset = () => {
    deviceList.value = []
  }

  return { deviceList, getDeviceTypeItem, initDevice, reset }
})
