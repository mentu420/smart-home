import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getDeviceList } from '@/apis/smartApi'

export default defineStore('deviceStore', () => {
  // 设备分类
  const deviceTypeList = ref([
    {
      name: 'lamp',
      classify: ['1000', '1001', '1002'],
      subCategory: ['10001', '100011'],
      icon: 'tips',
    }, //灯
    {
      name: 'led',
      classify: ['1010', '1011', '1012'],
      subCategory: ['10101', '10121'],
      icon: 'tips',
    }, //灯带
    {
      name: 'underfloorHeat',
      classify: ['1020', '1021', '1022'],
      subCategory: ['10201', '10221'],
      icon: 'boiler',
    }, //地暖
    {
      name: 'ariCooler',
      classify: ['1030', '1031', '1032', '1033'],
      subCategory: ['10301', '10311'],
      icon: 'air-conditioning',
    }, //空调
    {
      name: 'freshAir',
      classify: ['1040', '1041', '1042', '1043'],
      subCategory: ['10401', '10411'],
      icon: 'whirlwind',
    }, //新风
    {
      name: 'curtain',
      classify: ['1050', '1051', '1052', '1053'],
      subCategory: ['10501', '10511'],
      icon: 'book-open',
    }, //窗帘
    { name: 'music', classify: ['1080', '1081'], subCategory: ['10801', '10811'], icon: 'music' }, //音乐
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
