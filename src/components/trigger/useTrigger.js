import { useRect } from '@vant/use'
import { computed } from 'vue'

import { TYPE_VALUE_EXECL } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { throttle } from '@/utils/common'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

const { mqttPublish } = useMqtt()

export const useTrigger = () => {
  const getSceneActions = (modeList, id) => {
    const actions = modeList.map((modeItem) => {
      return {
        ziyuanleixing: 1,
        ziyuanbianhao: id,
        yanshi: 0,
        caozuo: {
          shuxing: modeItem.use,
          shuxingzhuangtai: modeItem.useStatus,
          shuxingzhi: modeItem.useValue,
        },
      }
    })

    return actions
  }

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
    console.log(use, deviceItem, config)
    mqttPublish({ ...useMode, id: deviceItem.id })
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

  return {
    getSceneActions,
    getUseKey,
    getModeColumns,
    triggerControl,
    disabledClass,
    isDisabled,
    getPlacement,
  }
}
