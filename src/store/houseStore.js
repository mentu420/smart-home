import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { getHouseList, getRoomList } from '@/apis/houseApi'
import { getStorage, removeStorage, setStorage } from '@/utils/storage.js'

export default defineStore('houseStore', () => {
  // 统一token处理
  const houseList = ref([])
  const roomList = ref([])
  const currentHouse = ref({})

  const setCurrentHouse = (id) => {
    currentHouse.value = houseList.value.find((item) => item.bianhao == id)
  }

  const editHouseList = (payload) => (houseList.value = payload)

  // 异步获取房屋列表
  const useGetHouseListSync = async (reload = false) => {
    console.log('reload', reload)
    if (houseList.value.length > 0 && !reload) return houseList.value
    const { data } = await getHouseList({ op: 1 })
    editHouseList(
      data.map((item) => ({ ...item, text: item.fangwumingcheng, value: item.bianhao }))
    )
    return houseList.value
  }

  const initHouse = async () => {
    const { data } = await getHouseList({ op: 1 })
    editHouseList(
      data.map((item) => ({ ...item, text: item.fangwumingcheng, value: item.bianhao }))
    )
    currentHouse.value = data[0]
  }

  // 异步获取房屋列表
  const useGetRoomListSync = async (reload = false) => {
    console.log('reload', reload)
    if (roomList.value.length > 0 && !reload) return roomList.value
    const { data } = await getRoomList({ op: 1 })
    roomList.value = data.map((item) => ({ ...item, text: item.mingcheng, id: item.bianhao }))
    return roomList.value
  }

  const initRoomList = async () => {
    const { data } = await getRoomList({ op: 1 })
    roomList.value = data.map((item) => ({ ...item, text: item.mingcheng, id: item.bianhao }))
  }

  const reset = () => {
    houseList.value = []
    roomList.value = []
    currentHouse.value = {}
  }

  return {
    houseList,
    roomList,
    currentHouse,
    initHouse,
    editHouseList,
    setCurrentHouse,
    initRoomList,
    reset,
    useGetHouseListSync,
    useGetRoomListSync,
  }
})
