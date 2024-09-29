import localforage from 'localforage'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import _ from 'lodash'
import { getDeviceList, getDeviceResource } from '@/apis/smartApi'
import { CLASSIFY_ICON, USE_KEY, TYPE_VALUE_EXECL } from '@/enums/deviceEnums'
import { isObjectString, stringToArray } from '@/utils/common'

const storeName = 'deviceStore'

export default defineStore(storeName, () => {
  const deviceList = ref([]) //设备列表
  const hostList = ref([]) //网关列表

  const init = async () => {
    const storeRes = JSON.parse(await localforage.getItem(storeName))
    deviceList.value = storeRes?.deviceList ?? []
    hostList.value = storeRes?.hostList ?? []
  }

  // 获取设备图片
  const getDeviceIcon = (classify) => CLASSIFY_ICON[classify]

  const includesUse = computed(() => (id, use) => {
    const useList = [
      ...new Set(deviceList.value.find((item) => item.id == id)?.columns?.map((item) => item.use)),
    ]
    return useList.includes(use)
  })

  function setModeColumns(columns) {
    const useList = [...new Set(columns?.map((item) => item.use))]
    const { VOLUME, PROCESS, PERCENT, ANGLE, BRIGHTNESS, TEMPERATURE, COLOURTEMPERATURE, SWITCH } =
      USE_KEY
    return useList.map((use) => {
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
      const useValue = valueIsNum ? (min ? parseInt(min) : 1) : '0'
      return {
        label: useColumns[0].useName, //当前模块名称
        use, // 当前模块标识
        useColumns, // 当前模块的选项
        useValue, // 当前模块控制值
        useStatus: SWITCH == use ? 'off' : useColumns[0].useEn, //当前模块控制状态
        valueIsNum,
      }
    })
  }

  const updateHostList = (newHostList) => {
    if (!hostList.value.length) {
      hostList.value = newHostList
    } else {
      hostList.value = hostList.value.reduce((acc, host) => {
        const newHost = newHostList.find((newHost) => newHost.id === host.id)

        if (newHost) {
          // 合并属性
          acc.push({
            ...host,
            ...newHost,
            online: host.online,
          })
        }

        return acc
      }, [])
    }
  }

  //异步获取设备列表
  const useGetDeviceListSync = async (reload = false) => {
    if (!reload && !deviceList.value.length) return deviceList.value
    const { data } = await getDeviceList({ op: 1 })
    const { data: resourceData } = await getDeviceResource()

    updateHostList(data.filter((item) => item.daleixing === '000'))

    const newDeviceList = data
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
          ...columns.map((columnItem) => ({
            [`${columnItem.use}-${columnItem.useEn}`]: columnItem.useCn,
          }))
        )

        const modeList = setModeColumns(columns)
        const resourceItem = resourceData.find(
          (resourceItem) => resourceItem.leixing == item.daleixing
        )
        return {
          ...item,
          modeNames,
          label: item.mingcheng,
          id: item.bianhao,
          rId: item.fangjianbianhao, //房间编号
          classify: item.daleixing,
          sort: item.paixu,
          collect: item.shouye == 1, // 首页是否收藏
          category: item.xiaoleixing,
          icon: getDeviceIcon(item.xiaoleixing.slice(0, 3)),
          iconUrl: resourceItem?.xiaotubiao,
          imageUrl: resourceItem?.tupian,
          columns, // 记录设备原始值
          // 记录当前设备模块控制值
          // mqtt 对应关系 {use:shuxing, useValue:shuxingzhi, useStatus:shuxingzhuangtai}
          modeList,
          // 记录设备操作状态数据
          modeStatusList: modeList.map(({ useColumns, ...statusItem }) => statusItem),
          loading: false, // 是否还在等待检查状态
          online: false, // 是否在线
        }
      })
      .sort((a, b) => a.sort - b.sort)

    if (!deviceList.value.length) {
      deviceList.value = newDeviceList
    } else {
      deviceList.value = deviceList.value.reduce((acc, device) => {
        const newDevice = newDeviceList.find((newDevice) => newDevice.id === device.id)

        if (newDevice) {
          // 合并属性
          acc.push({
            ...device,
            ...newDevice,
            online: device.online,
            modeStatusList: device.modeStatusList,
          })
        }

        return acc
      }, [])
    }

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

  const setDeviceLoading = (id, bool) => {
    deviceList.value = deviceList.value.map((deviceItem) => {
      if (deviceItem.id == id) {
        return { ...deviceItem, loading: bool }
      }
      return deviceItem
    })
  }

  const reset = () => {
    deviceList.value = []
  }

  return {
    deviceList,
    hostList,
    includesUse,
    getDeviceIcon,
    useGetDeviceListSync,
    useDeviceItemChange,
    useGetDeviceItem,
    reset,
    init,
    setModeColumns,
    setDeviceLoading,
  }
})
