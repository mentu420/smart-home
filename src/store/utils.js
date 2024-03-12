import deviceStore from '@/store/deviceStore'
import smartStore from '@/store/smartStore'
import houseStore from '@/store/houseStore'

// 刷新所有数据
export const reloadSync = async () => {
  const { useGetHouseListSync, useGetRoomListSync, useGetFloorListSync, useGetFamilyListSync } =
    houseStore()
  const { useGetDeviceListSync } = deviceStore()
  const { useGetSceneListSync, useGetSmartListSync } = smartStore()
  await Promise.all([
    useGetHouseListSync(true),
    useGetRoomListSync(true),
    useGetFloorListSync(true),
    useGetDeviceListSync(true),
    useGetSceneListSync(true),
    useGetSmartListSync(true),
    useGetFamilyListSync(true),
  ])
}
