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
    sceneList.value = storeRes?.sceneList
  }

  init()
  // 获取重复时间
  const getRepeatTimeText = computed(() => ({ type = 3, value = [] }) => {
    const repeatItem = repeatActions.value.find((item) => item.id == type)
    if (type == 3) {
      return repeatItem?.name
    } else if (type == 4) {
      return '周' + value.map((item) => weekData.value[item].replace('周', '')).join('、')
    } else if (type == 5) {
      return `${repeatItem?.name} - ${value.join(',')}${value.length ? '日' : ''}`
    } else if (type == 6) {
      return `${repeatItem?.name} - ${value[0]}月${value[1]}日`
    } else {
      return dayjs(value.join('-')).format(repeatItem.format)
    }
  })
  // 场景默认图库
  const sceneGallery = ref([
    {
      id: 0,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMS4xNjgwMTYzNzE5NzM2.jpg',
    },
    {
      id: 1,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMi4xNjgwMTYzNzIwOTQ5.jpg',
    },
    {
      id: 2,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMy4xNjgwMTYzNzIxNjY4.jpg',
    },
    {
      id: 3,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctNC4xNjgwMTYzNzIwMDg1.jpg',
    },
    {
      id: 4,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctNS4xNjgwMTYzNzIwNDQ2.jpg',
    },
    {
      id: 5,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctNi4xNjgwMTYzNzI1NjUy.jpg',
    },
    {
      id: 6,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctNy4xNjgwMTYzNzIyMzY1.jpg',
    },
    {
      id: 7,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctOC4xNjgwMTYzNzI0MDQ3.jpg',
    },
    {
      id: 8,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctOS4xNjgwMTYzNzIzMTM5.jpg',
    },
    {
      id: 9,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTAuMTY4MDE2MzcyNzgzNw==.jpg',
    },
    {
      id: 10,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTEuMTY4MDE2MzczNTMxOQ==.jpg',
    },
    {
      id: 11,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTIuMTY4MDE2MzczNjkzOQ==.jpg',
    },
    {
      id: 12,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTMuMTY4MDE2MzczOTAxNA==.jpg',
    },
    {
      id: 13,
      text: '主卧',
      src: 'https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMTQuMTY4MDE2Mzc0MTAzMw==.jpg',
    },
  ])
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
    if (sceneList.value.length > 0 && !reload) return sceneList.value
    const { data } = await getSceneList({ op: 1 })
    sceneList.value = transformList(data)
  }

  const useGetSmartListSync = async (reload = false) => {
    if (smartList.value.length > 0 && !reload) return smartList.value
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
    sceneGallery,
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
  }
})
