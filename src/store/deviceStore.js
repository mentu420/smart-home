import localforage from 'localforage'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getDeviceList } from '@/apis/smartApi'
import { CLASSIFY_ICON, CLASSIFY_EXECL, TYPE_EXECL, TYPE_VALUE_EXECL } from '@/enums/deviceEnums'

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

  const deviceUseList = computed(() => (id) => {
    return [
      ...new Set(deviceList.value.find((item) => item.id == id)?.columns?.map((item) => item.use)),
    ]
  })

  //异步获取设备列表
  const useGetDeviceListSync = async (reload = false) => {
    if (deviceList.value.length > 0 && !reload) return deviceList.value
    const { data } = await getDeviceList({ op: 1 })
    deviceList.value = data
      .map((item) => {
        const columns = TYPE_VALUE_EXECL.filter(
          (typeItem) => typeItem.category == item.xiaoleixing
        ).map((typeItem) => {
          // 重置开关属性值
          if (['valueSwitch', 'switch'].includes(typeItem.use) && typeItem.useEn === 'on') {
            return { ...typeItem, useValue: '1' }
          }
          return typeItem
        })
        const useList = [...new Set(columns?.map((item) => item.use))]
        return {
          icon: getDeviceIcon(item.xiaoleixing.slice(0, 3)),
          // 记录暑假原始值
          columns,
          // 记录当前设备模块控制值
          modeList: useList.map((use) => {
            const useColumns = columns.filter((item) => item.use == use)
            return {
              label: useColumns[0].useName, //当前模块名称
              use, // 当前模块标识
              useColumns, // 当前模块的选项
              modeValue: '', // 当前模块控制值
              modeStatus: '', //当前模块控制状态
              modeNames: Object.assign(
                {},
                ...columns.map((columnItem) => ({ [columnItem.useEn]: columnItem.useCn }))
              ),
            }
          }),
          label: item.mingcheng,
          id: item.bianhao,
          rId: item.fangjianbianhao, //房间编号
          classify: item.daleixing,
          sort: item.paixu,
          collect: item.shouye, // 首页是否收藏
          category: item.xiaoleixing,
        }
      })
      .sort((a, b) => a.sort - b.sort)
    return deviceList.value
  }

  const useGetDeviceItem = (id) => deviceList.value.find((item) => item.id == id)

  // 变更单设备数据
  const useDeviceItemChange = (payload) => {
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
    useDeviceItemChange,
    useGetDeviceItem,
    reset,
  }
})
