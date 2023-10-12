import deviceStore from '@/store/deviceStore'
import { debounce } from '@/utils/common'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

export const useTrigger = () => {
  const getSceneActions = (status, id, modeList) => {
    const modeListResult = modeList.filter((item) => item.use != 'switch')
    const actions = status.value
      ? [
          {
            ziyuanleixing: 1,
            ziyuanbianhao: id,
            yanshi: 0,
            caozuo: {
              shuxing: 'switch',
              shuxingzhuangtai: 'off',
              shuxingzhi: '',
            },
          },
        ]
      : modeListResult.map((modeItem) => {
          return {
            ziyuanleixing: 1,
            ziyuanbianhao: id,
            yanshi: 0,
            caozuo: {
              shuxing: modeItem.use,
              shuxingzhuangtai: 'off',
              shuxingzhi: modeItem.modeValue,
            },
          }
        })

    return actions
  }

  return { getSceneActions }
}
