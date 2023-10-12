import deviceStore from '@/store/deviceStore'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

export const useTrigger = () => {
  const getSceneActions = () => {}

  const getUseList = (id, columns) => {
    return deviceUseList(id).map((item) => {
      const list = columns.filter((columnItem) => columnItem.use == item)
      return { use: item, text: list[0].useName, list }
    })
  }

  return { getSceneActions, getUseList }
}
