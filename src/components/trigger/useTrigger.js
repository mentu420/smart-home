import { useRect } from '@vant/use'
import { computed } from 'vue'

import { TYPE_VALUE_EXECL, USE_KEY } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { throttle, stringToArray } from '@/utils/common'

const { useGetDeviceItem, useDeviceItemChange } = deviceStore()

const { mqttDevicePublish } = useMqtt()

export const useTrigger = () => {
  const getUseKey = (category) => {
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
  const getModeColumns = (use, modeList) => {
    return modeList
      .find((modeItem) => modeItem.use == use)
      .useColumns.sort((a, b) => a.useValue - b.useValue)
  }

  const triggerControl = throttle((use, deviceItem, config) => {
    const { modeList } = deviceItem
    const newModeList = modeList.map((modeItem) => {
      const modeConfig = config[modeItem.use]
      return { ...modeItem, ...modeConfig }
    })
    const useMode = newModeList.find((item) => item.use == use)
    mqttDevicePublish({ ...useMode, id: deviceItem.id })
    useDeviceItemChange({ ...deviceItem, modeList: newModeList })
  }, 500)

  const isDisabled = (config) => config?.switch?.useStatus == 'off'

  const disabledClass = computed(() => (config) => ({
    '!opacity-60': isDisabled(config),
  }))

  const getPlacement = (el) => {
    if (!el) return 'top'
    const { top } = useRect(el)
    return top > window.innerHeight / 2 ? 'top' : 'bottom'
  }

  const getModeActions = (deviceItem, use) => deviceItem?.columns.filter((item) => item.use == use)

  const getModeRange = (columns, use) => {
    const { useValueRange = '0,100' } = columns.find((item) => item.use == use) || {}
    return stringToArray(useValueRange)
  }

  const onConfigFormat = (config, modeList) => {
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

  return {
    getUseKey,
    getModeColumns,
    triggerControl,
    disabledClass,
    isDisabled,
    getPlacement,
    getModeActions,
    onConfigFormat,
    getModeRange,
  }
}
