import deviceStore from '@/store/deviceStore'
import smartStore from '@/store/smartStore'
import houseStore from '@/store/houseStore'
import userStore from './userStore'
import materialStore from './materialStore'
import socketStore from './socketStore'

export const initStoreSync = async () => {
  await userStore().init()
  await houseStore().init()
  await deviceStore().init()
  await smartStore().init()
  await materialStore().init()
  socketStore().init()
}

// 刷新所有数据
export const reloadStoreSync = async () => {
  const { useGetHouseListSync, useGetRoomListSync, useGetFloorListSync, useGetFamilyListSync } =
    houseStore()
  const { useGetDeviceListSync } = deviceStore()
  const { useGetSceneListSync, useGetSmartListSync } = smartStore()
  const { waitConnected, disReconnect } = socketStore()
  disReconnect()
  await Promise.all([
    useGetHouseListSync(true),
    useGetRoomListSync(true),
    useGetFloorListSync(true),
    useGetDeviceListSync(true),
    useGetSceneListSync(true),
    useGetSmartListSync(true),
    useGetFamilyListSync(true),
  ])
  waitConnected()
}

export const storeReset = () => {
  houseStore().reset()
  smartStore().reset()
  deviceStore().reset()
  userStore().reset()
  materialStore().reset()
}
