import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { getHouseList } from '@/apis/houseApi'
import { getStorage, removeStorage, setStorage } from '@/utils/storage.js'

export default defineStore('houseStore', () => {
  // 统一token处理
  const houseList = ref([])
  const currentHouse = ref({})

  const setCurrentHouse = (id) => {
    currentHouse.value = houseList.value.find((item) => item.id == id)
  }

  const initHouse = async () => {
    const { data } = await getHouseList({ op: 1 })
    houseList.value = data.map((item) => ({ ...item, text: item.fangwumingcheng }))
    currentHouse.value = data[0]
  }

  return { houseList, currentHouse, initHouse, setCurrentHouse }
})
