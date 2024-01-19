<script setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, onActivated, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import draggable from 'vuedraggable'

import { getHouseList, setCollectSort } from '@/apis/houseApi.js'
import { setDeviceList, setSceneList } from '@/apis/smartApi'
import DeviceCardItem from '@/components/base/DeviceCardItem.vue'
import ScenenCardItem from '@/components/base/ScenenCardItem.vue'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'
import userStore from '@/store/userStore'

defineOptions({ name: 'HousePage' })

const router = useRouter()
const route = useRoute()

const useHouseStore = houseStore()
const useDeviceStore = deviceStore()
const usesmartStore = smartStore()
const { houseList, floorList, currentHouse, roomList, currentPower } = storeToRefs(useHouseStore)
const { deviceList } = storeToRefs(useDeviceStore)
const { sceneList } = storeToRefs(usesmartStore)
const { mqttDevicePublish } = useMqtt()

const showHomeList = ref(false)
const loading = ref(false)
const showFloorConfig = ref(false)
const currentRoomId = ref('') //当前房间编号
const currentFloorId = ref('') //当前楼层id
const isTopFixed = ref(false) // top 吸顶
const isTabsFixed = ref(false) // tabs 吸顶
const roomFilterList = ref([]) // 当前楼层房间列表
const collectList = ref([
  {
    text: '常用场景',
    list: [],
    group: 'collect-scene',
  },
  {
    text: '常用设备',
    list: [],
    group: 'collect-device',
  },
])
const dragOptions = ref({
  animation: 200,
  disabled: true, //是否可以拖拽排序
  ghostClass: 'ghost',
})

watch(
  () => [sceneList.value, deviceList.value],
  ([sceneValue, deviceValue]) => {
    collectList.value = collectList.value.map((collectItem) => {
      const list = collectItem.group == 'collect-scene' ? sceneValue : deviceValue
      return {
        ...collectItem,
        list: list?.filter((item) => item.collect).sort((a, b) => a.shouyepaixu - b.shouyepaixu),
      }
    })
  }
)

// 是否展示拖拽按钮
const showDragBtn = computed(() => {
  if (currentRoomId.value == "''") {
    return collectList.value.some((item) => item.list?.length > 1)
  } else {
    const roomItem = roomFilterList.value?.find((roomItem) => roomItem.id == currentRoomId.value)
    return roomItem?.sceneList.length > 1 || roomItem?.deviceList?.length > 1
  }
})

// 控制设备
const onSwitchDeviceItem = ({ modeList, id }, status = null) => {
  const switchMode = modeList.find((item) => ['switch'].includes(item.use))
  if (switchMode) {
    const useStatus = status || switchMode.useStatus == 'on' ? 'off' : 'on'
    console.log('status', useStatus)
    mqttDevicePublish({ id, ...switchMode, useStatus, useValue: '1' })
  } else {
    if (status) return
    const playMode = modeList.find((item) => ['playControl'].includes(item.use))
    const useStatus = playMode.useStatus == 'play' ? 'pause' : 'play'
    mqttDevicePublish({ id, ...switchMode, useStatus, useValue: '1' })
  }
}

// 初始化数据 hId 初始化房屋id
// 请求完所有数据后设置当前房屋数据
const onReload = async (hId) => {
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
  useHouseStore.setCurrentHouse(hId)
  currentFloorId.value = floorList.value[0]?.id
}

// 拖拽排序
const onDragEnd = async () => {
  await nextTick()
  if (currentRoomId.value == "''") {
    const data = collectList.value
      .map((item) => item.list)
      .flat()
      .map((item, i) => {
        return {
          bianhao: item.id,
          paixu: i,
          paixuleixing: item.classify ? 1 : 2,
          leixing: 1,
        }
      })
    await setCollectSort({ params: { op: 13 }, data })
  } else {
    const { deviceList, sceneList } = roomFilterList.value.find(
      (item) => item.id == currentRoomId.value
    )
    console.log(deviceList, sceneList)
    await setDeviceList({
      params: { op: 7 },
      data: deviceList.map((item, i) => ({
        shebeibianhao: item.id,
        paixu: i,
      })),
    })
    await setSceneList({
      params: { op: 7 },
      data: sceneList.map((item, i) => ({
        changjingbianhao: item.id,
        paixu: i,
      })),
    })
  }
  dragOptions.value.disabled = !dragOptions.value.disabled
}

// 切换房屋
const onHouseSelect = async (action) => {
  try {
    loading.value = true
    const { useGetToken, useSetToken } = userStore()
    showHomeList.value = false
    const hId = action.id
    await getHouseList({ op: 5, fangwubianhao: hId })
    await onReload(hId)
    useSetToken({ ...useGetToken(), fangwubianhao: hId })
    setCurrentFloorRoomList()
  } finally {
    loading.value = false
  }
}
// 切换楼层
const onFloorSelect = (action) => {
  showFloorConfig.value = false
  currentFloorId.value = action.id
  setCurrentFloorRoomList()
}

// 设置当前楼层的房间
function setCurrentFloorRoomList() {
  roomFilterList.value = roomList.value
    .filter((roomItem) => roomItem.fId == currentFloorId.value)
    .map((roomItem) => {
      return {
        ...roomItem,
        deviceList: deviceList.value.filter((item) => item.rId == roomItem.id),
        sceneList: sceneList.value.filter((item) => item.rId == roomItem.id),
      }
    })
}
// 设备全开全关
function onAllDeviceToggle(deviceList, status) {
  deviceList.forEach((deviceItem) => {
    onSwitchDeviceItem(deviceItem, status)
  })
}

const onTopSticky = (isFixed) => {
  console.log('onTopSticky', isFixed)
  isTopFixed.value = isFixed
}

const onTabsScroll = ({ isFixed, scrollTop }) => {
  isTabsFixed.value = isFixed
}

const init = async () => {
  try {
    const { useGetToken, useUserInfoSync } = userStore()
    const token = useGetToken()
    if (!token) return
    await onReload(token.fangwubianhao)
    await useUserInfoSync()
    currentFloorId.value = floorList.value[0]?.id
    setCurrentFloorRoomList()
  } catch (err) {
    console.warn(err)
  } finally {
    loading.value = false
  }
}

onMounted(init)

onActivated(setCurrentFloorRoomList)

watch(
  () => route.path,
  (to, from) => {
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
        <van-sticky @change="onTopSticky">
          <div class="flex justify-between bg-page-gray" :class="{ 'pt-safe': isTopFixed }">
            <div class="p-4">
              <van-popover
                v-model:show="showHomeList"
                :actions="houseList"
                placement="bottom-start"
              >
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
            </div>
            <van-sticky>
              <div class="space-x-4 p-4">
                <van-icon size="20" name="bell" />
                <van-icon size="20" name="plus" @click="goAddDevice" />
              </div>
            </van-sticky>
          </div>
        </van-sticky>
        <!--天气-->
        <div v-if="currentHouse?.huanjingzhuangtai" class="min-h-10 flex items-end p-4">
          <h2>{{ currentHouse?.huanjingzhuangtai?.WenDu }}</h2>
          <p class="ml-1 mr-4 text-sm">℃</p>
        </div>
      </template>

      <div>
        <!--重新定义tabs-->
        <div class="h-[44px] overflow-hidden relative">
          <ul
            class="px-2 flex h-full overflow-x-auto overflow-y-hidden relative no-scrollbar box-content"
          >
            <li
              v-for="(roomItem, roomIndex) in [{ id: '-1', label: '全屋' }, ...roomFilterList]"
              :key="roomIndex"
              class="relative flex-none leading-[44px] flex"
              :class="{ 'text-black text-[16px] font-bold': currentRoomId === roomItem.id }"
              @click="
                () => {
                  if (!dragOptions.disabled) return
                  currentRoomId = roomItem.id
                }
              "
            >
              <span class="px-2">{{ roomItem.label }}</span>
            </li>
            <li class="relative flex-none leading-[44px] flex w-[70px]"></li>
          </ul>
          <!--切换楼层-->
          <div class="absolute right-0 z-[1] top-0 bg-white">
            <div class="flex h-[44px] w-[70px] flex-auto items-center justify-center space-x-4">
              <van-button
                v-if="!dragOptions.disabled"
                v-loading-click="() => onDragEnd()"
                round
                size="small"
                type="primary"
              >
                完成
              </van-button>
              <van-popover v-else v-model:show="showFloorConfig" placement="bottom-end">
                <template #reference>
                  <div class="flex items-center px-2 py-1 rounded-md bg-white space-x-1">
                    <p class="w-[40px] truncate text-xs shrink-0 text-center">
                      {{ floorList?.find((floorItem) => floorItem.id == currentFloorId)?.label }}
                    </p>
                    <van-icon name="arrow-down" />
                  </div>
                </template>
                <van-cell-group class="w-[50vw]">
                  <van-cell
                    v-for="floorItem in floorList"
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
        <van-tabs
          v-model:active="currentRoomId"
          class="house-tabs"
          background="#f7f7f7"
          shrink
          line-width="0"
          animated
          :swipeable="dragOptions.disabled"
          @scroll="onTabsScroll"
        >
          <van-tab title="全屋" :disabled="!dragOptions.disabled" name="-1">
            <section class="p-4">
              <template v-for="collectItem in collectList" :key="collectItem.text">
                <h4 class="mb-2 text-gray-600">{{ collectItem.text }}</h4>
                <draggable
                  v-model="collectItem.list"
                  item-key="id"
                  :group="collectItem.group"
                  v-bind="dragOptions"
                  class="grid grid-cols-2 gap-4"
                >
                  <template #item="{ element }">
                    <ScenenCardItem
                      v-if="collectItem.group == 'collect-scene'"
                      :id="element.id"
                      :is-drag="!dragOptions.disabled"
                    />
                    <DeviceCardItem v-else :id="element.id" :is-drag="!dragOptions.disabled" />
                  </template>
                </draggable>
                <van-empty
                  v-if="collectItem.list?.length == 0"
                  image-size="4rem"
                  image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
                  description="暂无收藏的场景"
                />
                <div class="h-6"></div>
              </template>
            </section>
          </van-tab>
          <!--当前楼层所有房间-->
          <van-tab
            v-for="(roomItem, roomIndex) in roomFilterList"
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
                  <ScenenCardItem :id="sceneItem.id" :is-drag="!dragOptions.disabled" />
                </template>
              </draggable>

              <template v-if="roomItem.deviceList.length > 0">
                <div class="flex items-center py-4">
                  <h4 class="text-gray-600">照明</h4>
                  <label class="ml-2 text-xs text-gray-400">
                    {{
                      roomItem.deviceList.filter((deviceItem) =>
                        deviceItem.modeList?.filter(
                          (modeItem) => modeItem?.use == 'switch' && modeItem?.useEn == 'on'
                        )
                      ).length
                    }}个灯亮
                  </label>
                </div>
                <div v-if="dragOptions.disabled" class="mb-4 grid grid-cols-2 gap-4">
                  <div
                    v-for="(switchItem, switchIndex) in [
                      { text: '全开', status: 'on' },
                      { text: '全关', status: 'off' },
                    ]"
                    :key="switchIndex"
                    v-clickable-active
                    class="w-full flex items-center overflow-hidden rounded-lg bg-gray-300 h-[76px] relative"
                    @click="onAllDeviceToggle(roomItem.deviceList, switchItem.status)"
                  >
                    <SmartImage
                      class="w-full h-full"
                      fit="cover"
                      src="https://derucci-app-obs.iderucci.com/cloud-derucci-system/20230330/c21hcnQtYmctMS4xNjgwMTYzNzE5NzM2.jpg"
                    />
                    <div
                      class="bg-black bg-opacity-50 p-3 absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center text-white"
                    >
                      {{ switchItem.text }}
                    </div>
                  </div>
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
                  <DeviceCardItem :id="deviceItem.id" :is-drag="!dragOptions.disabled" />
                </template>
              </draggable>
            </section>
          </van-tab>
        </van-tabs>
        <div v-if="showDragBtn" class="p-6 text-center">
          <van-button
            class="!px-6"
            size="small"
            type="primary"
            round
            @click="dragOptions.disabled = !dragOptions.disabled"
          >
            {{ dragOptions.disabled ? '编辑' : '取消' }}
          </van-button>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<style scoped lang="scss">
.house-tabs:deep(.van-tabs__wrap) {
  display: none !important;
}
</style>
