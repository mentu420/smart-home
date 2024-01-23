import localforage from 'localforage'
import { defineStore, storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { getHouseList, getRoomList, getFloorList, getFamily } from '@/apis/houseApi'

import deviceStore from './deviceStore'
import smartStore from './smartStore'
import userStore from './userStore'

const storeName = 'houseStore'

export default defineStore(storeName, () => {
  const houseList = ref([]) //用户的所有房屋
  const roomList = ref([]) //当前房屋的所有房间
  const floorList = ref([]) //当前房屋的所有楼层
  const familyList = ref([]) //当前房屋的所有成员
  const currentHouse = ref({}) //当前房屋
  const powerList = ref([], [], []) //编辑家人时的权限列表里 [id]
  const houseRoles = ref(['家庭所有者', '管理员', '普通成员']) // 家庭成员的三种角色

  const { deviceList } = storeToRefs(deviceStore())
  const { sceneList } = storeToRefs(smartStore())
  const { userInfo } = storeToRefs(userStore())
  const { useGetToken } = userStore()

  const init = async () => {
    const storeRes = JSON.parse(await localforage.getItem(storeName))
    houseList.value = storeRes?.houseList
    roomList.value = storeRes?.roomList
    floorList.value = storeRes?.floorList
    familyList.value = storeRes?.familyList
    currentHouse.value = storeRes?.currentHouse
  }

  init()

  // 切换当前房屋
  const setCurrentHouse = (id) => {
    currentHouse.value = houseList.value.find((item) => item.bianhao == id)
  }

  const setHouseList = (payload) => {
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
      const { fangwubianhao } = useGetToken()
      currentHouse.value =
        houseList.value.find((item) => item.id == fangwubianhao) || houseList.value[0]
    }
    return houseList.value
  }

  // 异步获取房屋列表
  const useGetRoomListSync = async (reload = false) => {
    if (roomList.value.length > 0 && !reload) return roomList.value
    const { data } = await getRoomList({ op: 1 })
    roomList.value = data
      .map((item) => ({
        ...item,
        label: item.mingcheng,
        id: item.bianhao,
        fId: item.quyubianhao, //楼层编号
        hId: item.fangwubianhao, //房屋编号
        sort: item.paixu || 0,
      }))
      .sort((a, b) => a.sort - b.sort)
    return roomList.value
  }

  const useSetRoomItem = (payload) => {
    roomList.value = roomList.value.map((item) => {
      if (item.id == payload.id) return { ...item, ...payload }
      return item
    })
  }

  // 异步获取楼层
  const useGetFloorListSync = async (reload = false) => {
    if (floorList.value.length > 0 && !reload) return floorList.value
    const { data } = await getFloorList({ op: 1 })
    floorList.value = data
      .map((item) => ({
        label: item.mingcheng,
        id: item.bianhao,
        hId: item.fangwubianhao,
        sort: item.paixu,
      }))
      .sort((a, b) => a.sort - b.sort)
    return floorList.value
  }
  // 异步获取家庭成员
  const useGetFamilyListSync = async (reload = false) => {
    if (familyList.value.length > 0 && !reload) return familyList.value
    const { data } = await getFamily({ op: 1 })
    familyList.value = data.map((item) => ({
      ...item,
      label: item.xingming,
      id: item.bianhao,
    }))
    return familyList.value
  }

  // 获取区域=>房间=>设备、场景树状组合数据 collect 是否只返回收藏数据
  const useGetFloorTree = () => {
    const getList = (list, rid) => list.filter((item) => item.rId == rid)

    return floorList.value.map((floorItem) => {
      const floorRoomList = roomList.value
        .filter((roomItem) => roomItem.fId == floorItem.id)
        .map((roomItem) => {
          const roomDeviceList = getList(deviceList.value, roomItem.id).sort(
            (a, b) => a.classify - b.classify
          )
          const roomSceneList = getList(sceneList.value, roomItem.id)

          return { ...roomItem, deviceList: roomDeviceList, sceneList: roomSceneList }
        })

      return { ...floorItem, roomList: floorRoomList }
    })
  }

  //登录用户当前房屋权限 0 所有者1 管理员 2普通成员
  const housePower = computed(() => {
    const familyItem = familyList.value.find(
      (familyItem) =>
        familyItem.fangwubianhao == currentHouse.value.id &&
        familyItem.shouji == userInfo.value?.shouji
    )
    //fangzhu=1 是家庭所有者，juese=1 是管理员，juese=0是普通成员
    const { fangzhu = 0, juese = 1 } = familyItem || {}
    return fangzhu == 1 ? 0 : juese == 1 ? 1 : 2
  })

  //获取家庭成员在当前房屋的权限0 所有者，1 管理员 2普通成员
  const houseRolePower = (familyItem) => {
    const { fangzhu = 0, juese = 1 } = familyItem || {}
    return fangzhu == 1 ? 0 : juese == 1 ? 1 : 2
  }

  //获取角色文本
  const getRolePowerName = computed(() => (familyItem) => {
    const index = houseRolePower(familyItem)
    return houseRoles.value[index]
  })

  const reset = () => {
    houseList.value = []
    roomList.value = []
    floorList.value = []
    familyList.value = []
    currentHouse.value = {}
  }

  return {
    houseList,
    roomList,
    floorList,
    familyList,
    currentHouse,
    powerList,
    houseRoles,
    getRolePowerName,
    housePower,
    houseRolePower,
    useGetFloorTree,
    editHouseList,
    setCurrentHouse,
    useGetHouseListSync,
    useGetRoomListSync,
    useSetRoomItem,
    useGetFloorListSync,
    useGetFamilyListSync,
    setHouseList,
    reset,
  }
})
