import dayjs from 'dayjs'
import localforage from 'localforage'
import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'

import { getSceneList, getSmartList } from '@/apis/smartApi'

const storeName = 'smartStore'

export default defineStore(storeName, () => {
  // 重复时间类型
  const repeatActions = ref([
    { id: 3, name: '每天', value: [], format: 'dd' },
    { id: 4, name: '每周', value: Array.from({ length: 6 }, (_, index) => index), format: '' },
    { id: 5, name: '每月', value: [], format: 'MM月' },
    { id: 6, name: '每年', value: [], format: 'MM月DD日' },
    { id: 7, name: '自定义日期', value: [], format: 'YYYY年MM月DD日' },
  ])
  // 定义周类型
  const weekData = ref({
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
  })
  // 创建场景数据
  const createSmartItem = ref({
    events: [],
  })

  const sceneList = ref([]) //全部场景列表
  const smartList = ref([]) //自动化列表

  const init = async () => {
    const storeRes = JSON.parse(await localforage.getItem(storeName))
    sceneList.value = storeRes?.sceneList ?? []
    smartList.value = storeRes?.smartList ?? []
  }

  // 获取重复时间
  const getRepeatTimeText = computed(() => ({ type = 3, value = [] }) => {
    const repeatItem = repeatActions.value.find((item) => item.id == type)
    if (type == 3) {
      return repeatItem?.name
    } else if (type == 4) {
      return '周' + value.map((item) => weekData.value[item]?.replace('周', '')).join('、')
    } else if (type == 5) {
      return `${repeatItem?.name} - ${value.join(',')}${value.length ? '日' : ''}`
    } else if (type == 6) {
      console.log(value)
      const arr = value[0]?.split('-') ?? []
      return `${repeatItem?.name} - ${arr[0] ?? 1}月${arr[1] ?? 1}日`
    } else {
      return dayjs(value.join('-')).format(repeatItem.format)
    }
  })

  // 更新创建场景数据
  const updateSceneCreateItem = (palyload) => {
    createSmartItem.value = { ...createSmartItem.value, ...palyload }
  }
  // 清空场景数据
  const clearSceneCreateItem = () => (createSmartItem.value = { events: [] })

  const transformList = (data) =>
    data
      .map((item, i) => {
        return {
          ...item,
          id: item.bianhao,
          label: item.mingcheng,
          rId: item.fangjianbianhao,
          sort: item.paixu ?? i,
          homeSort: item.shouyepaixu ?? i,
          collect: item.shouye == 1,
          loading: false,
        }
      })
      .sort((a, b) => a.sort - b.sort)

  const useGetSceneListSync = async (reload = false) => {
    if (!reload) return sceneList.value
    const { data } = await getSceneList({ op: 1 })
    sceneList.value = transformList(data)
  }

  const useGetSmartListSync = async (reload = false) => {
    if (!reload) return smartList.value
    const { data } = await getSmartList({ op: 1 })
    smartList.value = transformList(data)
  }

  const updateSceneList = (palyload) => {
    sceneList.value = sceneList.value.map((sceneItem) => {
      if (sceneItem.id == palyload.id) return { ...sceneItem, ...palyload }
      return sceneItem
    })
  }

  const getRoomSceneList = computed(
    () => (rid) => sceneList.value?.filter((item) => item.rid == rid)
  )

  const setSceneLoading = (id, bool) => {
    sceneList.value = sceneList.value.map((sceneItem) => {
      if (sceneItem.id == id) {
        return { ...sceneItem, loading: bool }
      }
      return sceneItem
    })
  }

  const reset = () => {
    createSmartItem.value = {}
    sceneList.value = []
  }

  return {
    createSmartItem,
    sceneList,
    smartList,
    repeatActions,
    weekData,
    getRepeatTimeText,
    getRoomSceneList,
    updateSceneCreateItem,
    clearSceneCreateItem,
    useGetSceneListSync,
    useGetSmartListSync,
    updateSceneList,
    setSceneLoading,
    reset,
    init,
  }
})
