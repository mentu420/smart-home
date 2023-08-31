import localforage from 'localforage'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { getHouseList, getRoomList } from '@/apis/houseApi'

const storeName = 'houseStore'

export default defineStore(storeName, () => {
  const houseList = ref([])
  const roomList = ref([])
  const currentHouse = ref({})

  const init = async () => {
    const storeRes = JSON.parse(await localforage.getItem(storeName))
    houseList.value = storeRes?.houseList
    roomList.value = storeRes?.roomList
    currentHouse.value = storeRes?.currentHouse
  }

  init()

  // 切换当前房屋
  const setCurrentHouse = (id) => {
    currentHouse.value = houseList.value.find((item) => item.bianhao == id)
  }

  const editHouseList = (payload) => (houseList.value = payload)

  // 异步获取房屋列表
  const useGetHouseListSync = async (reload = false) => {
    if (houseList.value.length > 0 && !reload) return houseList.value
    const { data } = await getHouseList({ op: 1 })
    houseList.value = data.map((item) => ({
      ...item,
      label: item.fangwumingcheng,
      text: item.fangwumingcheng,
      value: item.bianhao,
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
    roomList.value = data.map((item) => ({ ...item, label: item.mingcheng, id: item.bianhao }))
    return roomList.value
  }

  return {
    houseList,
    roomList,
    currentHouse,
    editHouseList,
    setCurrentHouse,
    useGetHouseListSync,
    useGetRoomListSync,
  }
})
