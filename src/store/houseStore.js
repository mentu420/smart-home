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

  const initHouse = async () => {
    const { data } = await getHouseList({ op: 1 })
    editHouseList(
      data.map((item) => ({ ...item, text: item.fangwumingcheng, value: item.bianhao }))
    )
    currentHouse.value = data[0]
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
  }
})
