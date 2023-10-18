import { TYPE_VALUE_EXECL } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import { debounce } from '@/utils/common'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

export const useTrigger = () => {
  const getSceneActions = (modeList, id) => {
    const actions = modeList.map((modeItem) => {
      return {
        ziyuanleixing: 1,
        ziyuanbianhao: id,
        yanshi: 0,
        caozuo: {
          shuxing: modeItem.use,
          shuxingzhuangtai: modeItem.modeStatus,
          shuxingzhi: modeItem.modeValue,
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

  return { getSceneActions, getUseKey, getModeColumns }
}
