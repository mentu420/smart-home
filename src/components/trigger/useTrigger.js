import { useRect } from '@vant/use'
import { computed } from 'vue'

import { TYPE_VALUE_EXECL, USE_KEY } from '@/enums/deviceEnums'
import { mqttDevicePublish } from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { throttle, stringToArray, debounce } from '@/utils/common'

//设备是否禁用 适用['100', '101', '102', '103', '104']
export const isDisabled = (config) => config?.switch?.useStatus == 'off'
//设备禁用颜色
export const disabledClass = computed(() => (config) => ({
  '!opacity-60': isDisabled(config),
}))
// 获取设备模块常量
export const getUseKey = (category) => {
  const USE_KEY = Object.assign(
    {},
    ...[
      ...new Set(
        TYPE_VALUE_EXECL.filter((item) => item.category == category).map((item) => item.use)
      ),
    ].map((item) => ({
      [item.toUpperCase()]: item,
    }))
  )
  return USE_KEY
}

// 用户获取switch开关属性列表
export const getModeColumns = (use, modeList) => {
  return modeList
    .find((modeItem) => modeItem.use == use)
    .useColumns.sort((a, b) => a.useValue - b.useValue)
}

// 设备模块气泡弹出位置
export const getPlacement = (el) => {
  if (!el) return 'top'
  const { top } = useRect(el)
  return top > window.innerHeight / 2 ? 'top' : 'bottom'
}
// 获取设备模块
export const getModeActions = (deviceItem, use) =>
  deviceItem?.columns.filter((item) => item.use == use)
// 获取设备模块范围值
export const getModeRange = (columns, use) => {
  const { useValueRange = '0,100' } = columns.find((item) => item.use == use) || {}
  return stringToArray(useValueRange)
}
// 设备配置
export const onConfigFormat = (config, modeList) => {
  const { SWITCH } = USE_KEY
  Object.keys(config).forEach((key) => {
    const modeItem = modeList.find((item) => item.use == key)
    if (modeItem) {
      config[key] = {
        useStatus: [SWITCH].includes(key) ? modeItem.useStatus || 'off' : modeItem.useStatus,
        useValue: modeItem.valueIsNum ? parseInt(modeItem.useValue) : modeItem.useValue || '1',
      }
    }
  })
  return config
}

/**
 * 控制设备
 * 设备控制时：不管是卡片的快捷控制还是控制页面控制，200ms内秒收到mqtt控制回应就算指令发送成功，此时需要更新控制的图片的状态；如果200ms没有收到mqtt控制回应，就不切换；如果200ms回应设备离线等操作失败时也不需要切换控制图片；
 * 控制后如果正常收到指令控制成功的mqtt消息回应，还要延时5S启动检查，刷新当前页面上设备真实状态，以保证获取设备的真实状态；（所有设备的状态数据要缓存起来，mqtt收到状态后就更新缓存
 * 原因：设备控制分两步，云端收到控制指令和设备真正控制成功后反馈状态两个阶段，也就是说云端收到控制就需要切换UI，因为设备动作时间不一，有的会要好几秒才会mqtt推送过来，所以要延时5s刷新下设备的真实状态；
 * 1：改变modeStatusList
 * 2：根据mqtt返回结果使用 modeList 改变 modeStatusList
 * **/
const statusTimeout = 200 //设备状态改变等待时间
const refreshTimeout = 5 * 1000 //设备从缓存更新状态时间
// 改变设备状态
export const onDeviceStatusChange = ({ id, use, useStatus, useValue }) => {
  setTimeout(() => {
    const { useDeviceItemChange, useGetDeviceItem } = deviceStore()
    const { modeStatusList = [], loading } = useGetDeviceItem(id)
    if (loading) return
    useDeviceItemChange({
      id,
      modeStatusList: modeStatusList.map((modeItem) => {
        if (modeItem.use == use) return { ...modeItem, useStatus, useValue }
        return modeItem
      }),
    })
  }, statusTimeout)
}

// 从缓存刷新设备
export const onDeviceStatusRefresh = debounce((id) => {
  const { useDeviceItemChange, useGetDeviceItem } = deviceStore()
  const { modeList = [] } = useGetDeviceItem(id)
  if (modeList.length == 0) return
  useDeviceItemChange({
    id,
    modeStatusList: modeList.map(({ useColumns, ...statusItem }) => statusItem),
  })
}, refreshTimeout)

// 设备模块控制
export const triggerControl = throttle(({ use, device, config }) => {
  const { modeStatusList, id } = device
  const newModeList = modeStatusList.map((modeItem) => {
    const modeConfig = config[modeItem.use]
    return { ...modeItem, ...modeConfig }
  })
  const useMode = newModeList.find((item) => item.use == use)
  const publishRes = { ...useMode, id }
  mqttDevicePublish(publishRes)
  onDeviceStatusChange(publishRes)
  onDeviceStatusRefresh(id)
}, 500)
