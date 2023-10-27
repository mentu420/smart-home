import localforage from 'localforage'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getDeviceList } from '@/apis/smartApi'
import { CLASSIFY_ICON, USE_KEY, TYPE_VALUE_EXECL } from '@/enums/deviceEnums'
import { isObjectString, stringToArray } from '@/utils/common'

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

  const includesUse = computed(() => (id, use) => {
    const useList = [
      ...new Set(deviceList.value.find((item) => item.id == id)?.columns?.map((item) => item.use)),
    ]
    return useList.includes(use)
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
        const modeNames = Object.assign(
          {},
          ...columns.map((columnItem) => ({ [columnItem.useEn]: columnItem.useCn }))
        )
        const useList = [...new Set(columns?.map((item) => item.use))]
        const { VOLUME, PROCESS, PERCENT, ANGLE, BRIGHTNESS, TEMPERATURE, COLOURTEMPERATURE } =
          USE_KEY
        return {
          modeNames,
          label: item.mingcheng,
          id: item.bianhao,
          rId: item.fangjianbianhao, //房间编号
          classify: item.daleixing,
          sort: item.paixu,
          collect: item.shouye, // 首页是否收藏
          category: item.xiaoleixing,
          icon: getDeviceIcon(item.xiaoleixing.slice(0, 3)),
          columns, // 记录暑假原始值
          // 记录当前设备模块控制值
          // mqtt 对应关系 {use:shuxing, useValue:shuxingzhi, useStatus:shuxingzhuangtai}
          modeList: useList.map((use) => {
            const useColumns = columns.filter((item) => item.use == use)
            const valueIsNum = [
              VOLUME,
              PROCESS,
              PERCENT,
              ANGLE,
              BRIGHTNESS,
              TEMPERATURE,
              COLOURTEMPERATURE,
            ].includes(use)
            const [min] = stringToArray(useColumns[0].useValueRange)
            const useValue = valueIsNum ? (min ? parseInt(min) : 1) : '1'
            return {
              label: useColumns[0].useName, //当前模块名称
              use, // 当前模块标识
              useColumns, // 当前模块的选项
              useValue, // 当前模块控制值
              useStatus: '', //当前模块控制状态
              valueIsNum,
            }
          }),
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

  // mqtt 改变设备状态
  const useDeviceMqttChange = (json) => {
    //{"bianhao":"9D3109E7-9236-4BE1-84B1-73B2A6FA4D5B","shuxing":"switch","shuxingzhuangtai":"on","shuxingzhi":""}
    if (!json || !isObjectString(json)) return
    const { bianhao, shuxing, shuxingzhuangtai, shuxingzhi = '1' } = JSON.parse(json)
    let deviceItem = deviceList.value.find((item) => item.id == bianhao)
    if (!deviceItem) return
    deviceItem = {
      ...deviceItem,
      modeList: deviceItem.modeList.map((modeItem) => {
        if (modeItem.use == shuxing) {
          return { ...modeItem, useValue: shuxingzhi || '1', useStatus: shuxingzhuangtai }
        }
        return modeItem
      }),
    }

    useDeviceItemChange(deviceItem)
  }

  const reset = () => {
    deviceList.value = []
  }

  return {
    deviceList,
    includesUse,
    getDeviceIcon,
    useGetDeviceListSync,
    useDeviceItemChange,
    useGetDeviceItem,
    useDeviceMqttChange,
    reset,
  }
})
