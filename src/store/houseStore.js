import localforage from 'localforage'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { getHouseList, getRoomList, getFloorList } from '@/apis/houseApi'

const storeName = 'houseStore'

export default defineStore(storeName, () => {
  const houseList = ref([]) //用户的所有房屋
  const roomList = ref([]) //当前房屋的所有房间
  const floorList = ref([]) //当前房屋的所有楼层
  const currentHouse = ref({}) //当前房屋

  const init = async () => {
    const storeRes = JSON.parse(await localforage.getItem(storeName))
    console.log('storeRes', storeRes)
    houseList.value = storeRes?.houseList
    roomList.value = storeRes?.roomList
    floorList.value = storeRes?.floorList
    currentHouse.value = storeRes?.currentHouse
  }

  init()

  // 切换当前房屋
  const setCurrentHouse = (id) => {
    currentHouse.value = houseList.value.find((item) => item.bianhao == id)
  }

  const setHouseItem = (payload) => {
    houseList.value = houseList.value.map((item) => {
      if (item.id == payload.id) return { ...item, ...payload }
      return item
    })
  }

  const editHouseList = (payload) => (houseList.value = payload)

  // 异步获取房屋列表
  const useGetHouseListSync = async (reload = false) => {
    if (houseList.value.length > 0 && !reload) return houseList.value
    const { data } = await getHouseList({ op: 1 })
    houseList.value = data.map((item) => ({
      ...item,
      label: item.fangwumingcheng,
      id: item.bianhao,
    }))
    if (!currentHouse.value || Object.keys(currentHouse.value).length == 0) {
      currentHouse.value = houseList.value[0]
    }

    return houseList.value
  }

  // 异步获取房屋列表
  const useGetRoomListSync = async (reload = false) => {
    if (roomList.value.length > 0 && !reload) return roomList.value
    const { data } = await getRoomList({ op: 1 })
    roomList.value = data.map((item) => ({
      ...item,
      label: item.mingcheng,
      id: item.bianhao,
      fId: item.quyubianhao, //楼层编号
      hId: item.fangwubianhao, //房屋编号
    }))
    return roomList.value
  }

  const useGetFloorListSync = async (reload = false) => {
    if (floorList.value.length > 0 && !reload) return floorList.value
    const { data } = await getFloorList({ op: 1 })
    floorList.value = data.map((item) => ({
      label: item.mingcheng,
      id: item.bianhao,
      hId: item.fangwubianhao,
      sort: item.paixu,
    }))
    return floorList.value
  }

  return {
    houseList,
    roomList,
    floorList,
    currentHouse,
    editHouseList,
    setCurrentHouse,
    useGetHouseListSync,
    useGetRoomListSync,
    useGetFloorListSync,
    setHouseItem,
  }
})
