<script setup>
import { storeToRefs } from 'pinia'
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import draggable from 'vuedraggable'

import { getHouseList } from '@/apis/houseApi.js'
import DeviceCardItem from '@/components/base/DeviceCardItem.vue'
import ScenenCardItem from '@/components/base/ScenenCardItem.vue'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import sceneStore from '@/store/sceneStore'
import userStore from '@/store/userStore'

defineOptions({ name: 'HousePage' })

const router = useRouter()
const route = useRoute()

const useHouseStore = houseStore()
const useDeviceStore = deviceStore()
const useSceneStore = sceneStore()
const { houseList, currentHouse, roomList } = storeToRefs(useHouseStore)
const { deviceList } = storeToRefs(useDeviceStore)
const { getDeviceIcon } = useDeviceStore
const { sceneList } = storeToRefs(useSceneStore)
const { mqttScenePublish } = useMqtt()

const showHomeList = ref(false)
const loading = ref(false)
const showFloorConfig = ref(false)
const tabActive = ref(0)
const floorTree = ref([]) // 楼层树状结构数据
const currentFloorId = ref('') //当前楼层id
const currentFloorRoomList = ref([]) // 当前楼层房间
const isTabsFixed = ref(false) // tabs 吸顶
const dragOptions = ref({
  animation: 200,
  disabled: true, //是否可以拖拽排序
  ghostClass: 'ghost',
})

const collectList = ref([
  {
    id: 0,
    label: '常用场景',
    data: [],
    component: ScenenCardItem,
  },
  {
    id: 1,
    label: '常用设备',
    data: [],
    component: DeviceCardItem,
  },
]) //收藏的场景、设备

const getDeviceStatus = computed(() => (deviceItem) => {
  const { modeList, classify } = deviceItem
  if (['100', '102', '103', '104'].includes(classify)) {
    return modeList.some((modeItem) => modeItem.use == 'switch' && modeItem.useStatus == 'on')
      ? 1
      : 0
  } else {
    return 0
  }
})

const onConfigSelect = (action) => {
  console.log(action)
  tabActive.value = roomList.value.findIndex((value) => value.id == action.id) + 1
}

const openDeviceStatus = (item) => {
  console.log(item)
  router.push({
    path: '/smart-device-status',
    query: { id: item.id, name: item.label, classify: item.classify },
  })
}

// 初始化数据 hId 初始化房屋id
// 请求完所有数据后设置当前房屋数据
const onReload = async (hId) => {
  const { useGetHouseListSync, useGetRoomListSync, useGetFloorListSync, useGetFamilyListSync } =
    houseStore()
  const { useGetDeviceListSync } = deviceStore()
  const { useGetSceneListSync } = sceneStore()
  await Promise.all([
    useGetHouseListSync(true),
    useGetRoomListSync(true),
    useGetFloorListSync(true),
    useGetDeviceListSync(true),
    useGetSceneListSync(true),
    useGetFamilyListSync(true),
  ])
  useHouseStore.setCurrentHouse(hId)
}

// 拖拽排序
const onDragEnd = () => {
  dragOptions.value.disabled = !dragOptions.value.disabled
  const { deviceList, sceneList } = currentFloorRoomList.value.find(
    (item) => item.id == tabActive.value
  )
  console.log(deviceList, sceneList)
}

const onHouseSelect = async (action) => {
  try {
    loading.value = true
    const { useGetToken, useSetToken } = userStore()
    showHomeList.value = false
    const hId = action.id
    await getHouseList({ op: 5, fangwubianhao: hId })
    await onReload(hId)
    useSetToken({ ...useGetToken(), fangwubianhao: hId })
  } finally {
    loading.value = false
  }
}

const onFloorSelect = (action) => {
  console.log(action)
  currentFloorId.value = action.id
  showFloorConfig.value = false
  currentFloorRoomList.value = floorTree.value.find(
    (item) => item.id == currentFloorId.value
  )?.roomList
}

const getFloorTree = () => {
  collectList.value = collectList.value.map((item) => {
    if (item.id == 0) {
      return { ...item, data: sceneList.value?.filter((sceneItem) => sceneItem.shouye == 1) }
    }
    return { ...item, data: deviceList.value?.filter((deviceItem) => deviceItem.collect == 1) }
  })
  floorTree.value = useHouseStore.useGetFloorTree()
}

const init = async () => {
  try {
    const { useGetToken } = userStore()
    const token = useGetToken()
    if (!token) return
    await onReload(token.fangwubianhao)
    getFloorTree()
    currentFloorId.value = floorTree.value[0]?.id
    currentFloorRoomList.value = floorTree.value.find(
      (item) => item.id == currentFloorId.value
    )?.roomList
  } catch (err) {
    console.warn(err)
  } finally {
    loading.value = false
  }
}

onMounted(init)

onActivated(() => {
  getFloorTree()
  currentFloorRoomList.value = floorTree.value.find(
    (item) => item.id == currentFloorId.value
  )?.roomList
})

watch(
  () => route.path,
  (to, from) => {
    console.log(to, from)
    if (to == '/tabbar/tabbar-house' && ['/account-login', '/phone-login'].includes(from)) {
      init()
    }
  }
)

const goAddDevice = () => router.push({ path: '/house-add-device' })
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <van-pull-refresh
      v-model="loading"
      class="min-h-[80vh]"
      :disabled="!dragOptions.disabled"
      @refresh="init"
    >
      <template v-if="dragOptions.disabled">
        <!--当前房屋-->
        <div class="flex justify-between p-4">
          <van-popover v-model:show="showHomeList" :actions="houseList" placement="bottom-start">
            <van-cell-group>
              <van-cell
                v-for="houseItem in houseList"
                :key="houseItem.id"
                @click="onHouseSelect(houseItem)"
              >
                <template #title>
                  <div class="flex justify-center items-center">
                    <van-icon v-if="currentHouse?.id == houseItem.id" name="location" />
                    <label>{{ houseItem.label }}</label>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
            <template #reference>
              <div class="flex items-center space-x-4">
                <h3>{{ currentHouse?.label }}</h3>
                <van-icon name="arrow-down" />
              </div>
            </template>
          </van-popover>
          <div class="space-x-4">
            <van-icon size="20" name="bell" />
            <van-icon size="20" name="plus" @click="goAddDevice" />
          </div>
        </div>
        <!--天气-->
        <div v-if="currentHouse?.huanjingzhuangtai" class="min-h-10 flex items-end p-4">
          <h2>{{ currentHouse?.huanjingzhuangtai?.WenDu }}</h2>
          <p class="ml-1 mr-4 text-sm">℃</p>
        </div>
      </template>
      <!--tab-->
      <div class="relative">
        <van-tabs
          v-model:active="tabActive"
          background="#f7f7f7"
          shrink
          sticky
          line-width="0"
          animated
          :swipeable="dragOptions.disabled"
          @scroll="({ isFixed }) => (isTabsFixed = isFixed)"
        >
          <template #nav-right>
            <div class="w-[70px] flex-shrink-0"></div>
          </template>
          <van-tab title="全屋" :disabled="!dragOptions.disabled" name="''">
            <section class="p-4">
              <template v-for="collectItem in collectList" :key="collectItem.id">
                <h4 class="mb-2 text-gray-600">{{ collectItem.label }}</h4>
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <component
                    :is="{ ...collectItem.component }"
                    v-for="commonItem in collectItem.data"
                    :key="commonItem.id"
                    :status="getDeviceStatus(commonItem)"
                    @click="
                      () => {
                        if (collectItem.id == 0) mqttScenePublish({ id: commonItem.id })
                      }
                    "
                    @click-right-icon="openDeviceStatus(commonItem)"
                  >
                    <label>
                      {{ commonItem.label }}
                    </label>
                  </component>
                </div>
              </template>
            </section>
          </van-tab>
          <!--当前楼层所有房间-->
          <van-tab
            v-for="(roomItem, roomIndex) in currentFloorRoomList"
            :key="roomIndex"
            :title="roomItem.label"
            :disabled="!dragOptions.disabled"
            :name="roomItem.id"
          >
            <section class="p-4">
              <draggable
                v-model="roomItem.sceneList"
                item-key="id"
                group="scene"
                v-bind="dragOptions"
                class="grid grid-cols-2 gap-4"
              >
                <template #item="{ element: sceneItem }">
                  <ScenenCardItem @click="mqttScenePublish({ id: sceneItem.id })">
                    <label>{{ sceneItem.label }}</label>
                    <div v-if="!dragOptions.disabled" class="absolute top-2 right-2">
                      <van-icon name="wap-nav" />
                    </div>
                  </ScenenCardItem>
                </template>
              </draggable>

              <template v-if="roomItem.deviceList.length > 0">
                <div class="flex items-center py-4">
                  <h4 class="text-gray-600">照明</h4>
                  <label class="ml-2 text-xs text-gray-400"
                    >{{
                      roomItem.deviceList.filter((deviceItem) =>
                        deviceItem.modeList.some(
                          (modeItem) => modeItem.use == 'switch' && modeItem.useEn == 'on'
                        )
                      ).length
                    }}个灯亮</label
                  >
                </div>
                <div class="mb-4 grid grid-cols-2 gap-4">
                  <ScenenCardItem
                    v-for="(sceneItem, sceneIndex) in ['全开', '全关']"
                    :key="sceneIndex"
                  >
                    <label>{{ sceneItem }}</label>
                  </ScenenCardItem>
                </div>
              </template>
              <van-empty v-else image="search" description="暂无设备">
                <van-button class="!px-6" size="small" type="primary" round @click="goAddDevice">
                  添加设备
                </van-button>
              </van-empty>

              <draggable
                v-model="roomItem.deviceList"
                item-key="id"
                group="device"
                v-bind="dragOptions"
                class="grid grid-cols-2 gap-4"
              >
                <template #item="{ element: deviceItem }">
                  <DeviceCardItem
                    :label="deviceItem.label"
                    :icon="getDeviceIcon(deviceItem.classify)"
                    :status="getDeviceStatus(deviceItem)"
                    @click-right-icon="openDeviceStatus(deviceItem)"
                  >
                    <template v-if="!dragOptions.disabled" #right-icon>
                      <van-icon name="wap-nav" />
                    </template>
                  </DeviceCardItem>
                </template>
              </draggable>
            </section>
            <div v-if="roomItem.deviceList.length > 0" class="p-6 text-center">
              <van-button
                v-if="dragOptions.disabled"
                class="!px-6"
                size="small"
                type="primary"
                round
                @click="dragOptions.disabled = !dragOptions.disabled"
              >
                {{ dragOptions.disabled ? '编辑' : '完成' }}
              </van-button>
            </div>
          </van-tab>
        </van-tabs>
        <!--切换楼层-->
        <div class="right-0 top-0 bg-page-gray z-[100]" :class="isTabsFixed ? 'fixed' : 'absolute'">
          <div class="flex h-[44px] w-[70px] flex-auto items-center justify-center space-x-4">
            <van-button
              v-if="!dragOptions.disabled"
              round
              size="small"
              type="primary"
              @click="onDragEnd"
            >
              完成
            </van-button>
            <van-popover
              v-else
              v-model:show="showFloorConfig"
              placement="bottom-end"
              @select="onConfigSelect"
            >
              <template #reference>
                <div class="flex items-center px-2 py-1 rounded-md bg-white space-x-1">
                  <p class="w-[40px] truncate text-xs shrink-0 text-center">
                    {{ floorTree.find((floorItem) => floorItem.id == currentFloorId)?.label }}
                  </p>
                  <van-icon name="arrow-down" />
                </div>
              </template>
              <van-cell-group class="w-[50vw]">
                <van-cell
                  v-for="floorItem in floorTree"
                  :key="floorItem.id"
                  @click="onFloorSelect(floorItem)"
                >
                  <template #title>
                    <div class="flex justify-center items-center">
                      <van-icon v-if="currentFloorId == floorItem.id" name="location" />
                      <label>{{ floorItem.label }}</label>
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-popover>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
