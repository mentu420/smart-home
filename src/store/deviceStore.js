import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getDeviceList } from '@/apis/smartApi'

export default defineStore('deviceStore', () => {
  // 设备分类
  const deviceTypeList = ref([
    {
      name: 'lamp',
      text: '灯',
      classify: '100',
      subCategory: ['100001', '100002', '100003', '100004'],
      icon: 'tips',
    },
    {
      name: 'curtain',
      text: '窗帘',
      classify: '101',
      subCategory: ['101001', '101002', '101003', '101004', '101005', '101006', '101007', '101008'],
      icon: 'book-open',
    },
    {
      name: 'ariCooler',
      text: '空调',
      classify: '102',
      subCategory: ['102001', '102002', '102003', '102004', '102005'],
      icon: 'air-conditioning',
    },
    {
      name: 'underfloorHeat',
      text: '地暖',
      classify: '103',
      subCategory: ['103001', '103002', '103003'],
      icon: 'boiler',
    },
    {
      name: 'freshAir',
      text: '新风',
      classify: '104',
      subCategory: ['104001', '104002', '104003', '104004'],
      icon: 'whirlwind',
    },
    {
      name: 'music',
      text: '音乐',
      classify: '105',
      subCategory: ['105001', '105002', '105003'],
      icon: 'music',
    }, //音乐
  ])

  const deviceList = ref([])

  const getDeviceTypeItem = computed(() => (value, key = 'classify') => {
    return (
      deviceTypeList.value.find((deviceItem) => deviceItem[key].includes(value)) || {
        icon: 'tips',
        name: '未知设备',
        classify: [],
        subCategory: [],
      }
    )
  })

  const initDevice = async () => {
    const { data } = await getDeviceList({ op: 1 })
    deviceList.value = data
  }

  return { deviceTypeList, deviceList, getDeviceTypeItem, initDevice }
})
