<script setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, onActivated, onMounted, ref, watch, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { setCollectSort } from '@/apis/houseApi.js'
import { setDeviceList, setSceneList } from '@/apis/smartApi'
import DeviceCardItem from '@/pages/tabbar/components/DeviceCardItem.vue'
import HousePopover from '@/pages/tabbar/components/HousePopover.vue'
import ScenenCardItem from '@/pages/tabbar/components/ScenenCardItem.vue'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'
import userStore from '@/store/userStore'
import collectEmptyImage from '@/assets/images/empty/custom-empty-image.png'
import { useScreenSafeArea } from '@vueuse/core'
import { CLASSIFY_EXECL } from '@/enums/deviceEnums'
import { initStoreSync } from '@/store/utils'

defineOptions({ name: 'HousePage' })

const router = useRouter()
const route = useRoute()

const { houseList, floorList, currentHouse, roomList, houseUserPower } = storeToRefs(houseStore())
const { deviceList } = storeToRefs(deviceStore())
const { sceneList } = storeToRefs(smartStore())
const skeletonLoading = ref(false)
const loading = ref(false)
const currentRoomId = ref('-1') //当前房间编号
const tabsRef = ref(null)
const currentFloorId = ref('') //当前楼层id
const isTopFixed = ref(false) // top 吸顶
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

// 所有房间、设备、场景数据集合
const roomTabs = ref([])

function getRoomTabs() {
  roomTabs.value = roomList.value?.map((roomItem) => {
    const roomDeviceList = deviceList.value?.filter((item) => item.rId == roomItem.id)
    return {
      ...roomItem,
      sceneList: sceneList.value?.filter((item) => item.rId == roomItem.id),
      classifyDeviceList: CLASSIFY_EXECL.map((item) => {
        return {
          ...item,
          deviceList: roomDeviceList.filter((deviceItem) => deviceItem.classify === item.classify),
        }
      }).filter((item) => item.deviceList.length > 0),
    }
  })
}

watch(
  () => [roomList.value.length, deviceList.value.length, sceneList.value.length],
  (val, old) => {
    if (val.every((value, index) => value === old[index])) return
    getRoomTabs()
  }
)

// 当前楼层房间列表
const roomFilterList = computed(() => {
  return roomTabs.value?.filter((roomItem) => roomItem.fId == currentFloorId.value)
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
  if (currentRoomId.value == '-1') {
    return collectList.value.some((item) => item.list?.length > 1)
  } else {
    const roomItem = roomFilterList.value?.find((roomItem) => roomItem.id == currentRoomId.value)
    return roomItem?.sceneList.length > 1 || roomItem?.classifyDeviceList?.length > 1
  }
})

// 初始化数据 hId 初始化房屋id
// 请求完所有数据后设置当前房屋数据
const onReload = async (hId, reload) => {
  // 防止token中的默认房屋被删除
  if (houseList.value.length > 0 && !houseList.value.some((item) => item.id == hId)) {
    hId = houseList.value[0].id
  }

  const { setCurrentHouse } = houseStore()
  await setCurrentHouse(hId, reload)
  getRoomTabs()
}

const onDragCancel = () => {
  dragOptions.value.disabled = !dragOptions.value.disabled
}

// 拖拽排序
const onDragEnd = async () => {
  await nextTick()
  if (currentRoomId.value == '-1') {
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
    const { classifyDeviceList, sceneList } = roomFilterList.value.find(
      (item) => item.id == currentRoomId.value
    )

    if (classifyDeviceList.length > 0) {
      for (const item of classifyDeviceList) {
        await setDeviceList({
          params: { op: 7 },
          data: item.deviceList.map((item, i) => ({
            shebeibianhao: item.id,
            paixu: i,
          })),
        })
      }
    }
    if (sceneList.length > 0) {
      await setSceneList({
        params: { op: 7 },
        data: sceneList.map((item, i) => ({
          changjingbianhao: item.id,
          paixu: i,
        })),
      })
    }
  }
  dragOptions.value.disabled = !dragOptions.value.disabled
}

// 切换房屋
const onHouseSelect = async (action) => {
  try {
    loading.value = true
    const hId = action.id
    await onReload(hId, true)
  } finally {
    setDefaultCurrentFloorId()
    loading.value = false
  }
}

// 自定义 tabs 滚动事件
const scrollContainerRef = ref(null)
const onRoomChange = (id, roomIndex) => {
  if (!dragOptions.value.disabled) return
  currentRoomId.value = id
  const item = scrollContainerRef.value.children[roomIndex]
  const containerWidth = scrollContainerRef.value.offsetWidth
  const itemWidth = item.offsetWidth
  const itemLeft = item.offsetLeft

  scrollContainerRef.value.scrollTo({
    left: itemLeft - (containerWidth - itemWidth) / 2,
    behavior: 'smooth',
  })
}

const onRoomSwipeChange = () => {
  let roomIndex = roomFilterList.value.findIndex((item) => item.id === currentRoomId.value) + 1
  roomIndex === -1 ? 0 : roomIndex + 1
  onRoomChange(currentRoomId.value, roomIndex)
}

// app 滑动到顶部
const onAppScrollend = async () => {
  const { top } = useScreenSafeArea()
  setTimeout(() => {
    const h = parseInt(unref(top) || 0)
    const scrollableEl = document.getElementById('app')
    if (scrollableEl.scrollTop >= h) return
    scrollableEl.scroll({
      top: 0, // 滚动到距离顶部 100px 的位置
      behavior: 'smooth', // 使用平滑滚动
    })
  }, 350)
}

const init = async (showSkeleton = true) => {
  const { useGetToken, useUserInfoSync } = userStore()
  try {
    loading.value = true
    skeletonLoading.value = showSkeleton
    dragOptions.value.disabled = true
    const token = useGetToken()
    if (!token) return
    await onReload(token.fangwubianhao)
  } catch (err) {
    console.warn(err)
  } finally {
    await useUserInfoSync()
    setDefaultCurrentFloorId()
    loading.value = false
    skeletonLoading.value = false
  }
}

function setDefaultCurrentFloorId() {
  currentFloorId.value = floorList.value[0]?.id
}

onMounted(async () => {
  await initStoreSync()
  const noData = houseList.value?.length == 0
  if (!noData) {
    setDefaultCurrentFloorId()
    getRoomTabs()
  }
  setTimeout(() => init(noData), noData ? 4 : 5000)
})

onActivated(() => {
  dragOptions.value.disabled = true
  if (!floorList.value.some((item) => item.id == currentFloorId.value)) {
    setDefaultCurrentFloorId()
  }
})

watch(
  () => route.path,
  (to, from) => {
    if (to == '/tabbar' && ['/account-login', '/phone-login'].includes(from)) {
      init()
    }
  }
)

const goAddDevice = () => router.push({ path: '/house-add-device' })
</script>

<template>
  <div v-touch:swipe.top="onAppScrollend">
    <van-skeleton :loading="skeletonLoading">
      <template #template>
        <ul class="h-screen w-full mt-safe overflow-hidden">
          <li class="h-[20px] my-[12px] bg-gray-200"></li>
          <li class="h-[30px]"></li>
          <li class="h-[20px] my-[12px] bg-gray-200"></li>
          <li class="h-[16px] bg-gray-200 w-[30vw] my-[12px]"></li>
          <li class="mb-4">
            <ol class="grid gap-4 grid-cols-2 md:grid-cols-4">
              <li
                v-for="cardItem in 2"
                :key="cardItem"
                class="bg-gray-200 rounded-lg h-[76px]"
              ></li>
            </ol>
          </li>
          <li class="h-[16px] bg-gray-200 w-[30vw] my-[12px]"></li>
          <li class="mb-4">
            <ol class="grid gap-4 grid-cols-2 md:grid-cols-4">
              <li
                v-for="cardItem in 16"
                :key="cardItem"
                class="bg-gray-200 rounded-lg h-[124px]"
              ></li>
            </ol>
          </li>
        </ul>
      </template>
      <div class="min-h-screen bg-page-gray p-safe flex-1">
        <!--当前房屋-->
        <van-sticky
          :class="{ '!h-0': isTopFixed }"
          z-index="5"
          @change="(isFixed) => (isTopFixed = isFixed)"
        >
          <transition name="van-fade">
            <section v-if="dragOptions.disabled && !isTopFixed" class="bg-page-gray mb-[30px]">
              <div class="flex justify-between py-3 items-center px-4 space-x-4 transition-all">
                <HousePopover
                  :model-value="currentHouse?.id"
                  :actions="houseList"
                  :more-action="{ path: '/me-house-list', label: '房屋管理' }"
                  placement="bottom-start"
                  @select="onHouseSelect"
                >
                  <template #reference>
                    <div class="flex items-center space-x-2 text-[16px]">
                      <p class="max-w-[240px] truncate font-bold">{{ currentHouse?.label }}</p>
                      <van-loading v-if="loading" size="20" />
                      <IconFont v-else class="text-[6px]" icon="triangle-bottom" />
                    </div>
                  </template>
                </HousePopover>
                <div class="space-x-4 shrink-0">
                  <van-icon
                    v-if="houseUserPower(currentHouse?.id) != 2"
                    size="20"
                    name="plus"
                    @click="goAddDevice"
                  />
                </div>
              </div>
            </section>
          </transition>
        </van-sticky>

        <div
          v-if="isTopFixed"
          class="fixed left-0 right-0 w-full top-0 house-top__placeholder bg-page-gray z-[5]"
        ></div>

        <section class="bg-page-gray sticky z-10 house-tabs">
          <div
            class="h-[44px] overflow-hidden relative text-[16px] flex justify-between items-center"
          >
            <ul
              ref="scrollContainerRef"
              class="flex h-full overflow-x-auto overflow-y-hidden relative no-scrollbar box-content pl-2"
            >
              <li
                v-for="(roomItem, roomIndex) in [{ id: '-1', label: '全屋' }].concat(
                  roomFilterList
                )"
                :key="roomIndex"
                class="relative flex-none leading-[44px] flex px-2 transition-all"
                :class="{ 'text-black font-bold': currentRoomId === roomItem.id }"
                @click="onRoomChange(roomItem.id, roomIndex)"
              >
                {{ roomItem.label }}
              </li>
            </ul>
            <!--切换楼层-->
            <div class="shrink-0 pl-2 bg-page-gray">
              <div
                class="flex h-[28px] my-[8px] w-[78px] flex-auto items-center justify-center space-x-4 rounded-l-lg"
                :class="{ 'bg-white': dragOptions.disabled }"
              >
                <van-button
                  v-if="!dragOptions.disabled"
                  v-loading-click="onDragEnd"
                  round
                  type="gray"
                  class="!px-3"
                  size="small"
                >
                  完成
                </van-button>
                <HousePopover
                  v-else
                  v-model="currentFloorId"
                  :actions="floorList"
                  :more-action="{
                    path: `/me-room-manage?id=${currentHouse?.id}`,
                    label: '房间管理',
                  }"
                  placement="bottom-end"
                >
                  <template #reference>
                    <div class="flex items-center py-1 space-x-1">
                      <p class="w-[40px] truncate text-xs shrink-0 text-center">
                        {{ floorList?.find((floorItem) => floorItem.id == currentFloorId)?.label }}
                      </p>
                      <van-loading v-if="loading" size="20" />
                      <IconFont v-else class="text-[6px]" icon="triangle-bottom" />
                    </div>
                  </template>
                </HousePopover>
              </div>
            </div>
          </div>
        </section>

        <van-tabs
          ref="tabsRef"
          v-model:active="currentRoomId"
          class="house-tabs__hide"
          background="#f7f7f7"
          shrink
          line-width="0"
          animated
          :swipeable="dragOptions.disabled"
          @change="onRoomSwipeChange"
        >
          <van-tab title="全屋" :disabled="!dragOptions.disabled" name="-1">
            <section class="p-4 min-h-[85vh]">
              <template v-for="collectItem in collectList" :key="collectItem.text">
                <h4 class="mb-2 text-gray-600">{{ collectItem.text }}</h4>
                <draggable
                  v-model="collectItem.list"
                  item-key="id"
                  :group="collectItem.group"
                  v-bind="dragOptions"
                  class="grid grid-cols-2 md:grid-cols-4 gap-4"
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
                  :image="collectEmptyImage"
                  :description="`暂无收藏的${
                    collectItem.group == 'collect-scene' ? '场景' : '设备'
                  }`"
                />
                <div class="h-6"></div>
              </template>
              <div v-if="showDragBtn" class="p-6 text-center">
                <van-button class="!px-6" size="small" plain round @click="onDragCancel">
                  {{ dragOptions.disabled ? '编辑' : '取消' }}
                </van-button>
              </div>
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
            <section class="p-4 min-h-[85vh]">
              <draggable
                v-model="roomItem.sceneList"
                item-key="id"
                group="scene"
                v-bind="dragOptions"
                class="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <template #item="{ element: sceneItem }">
                  <ScenenCardItem :id="sceneItem.id" :is-drag="!dragOptions.disabled" />
                </template>
              </draggable>

              <template v-if="roomItem.classifyDeviceList.length > 0">
                <div
                  v-for="classifyItem in roomItem.classifyDeviceList"
                  :key="classifyItem.classify"
                >
                  <div class="flex items-center py-4">
                    <h4 class="text-gray-600">{{ classifyItem.classifyName }}</h4>
                  </div>
                  <draggable
                    v-model="classifyItem.deviceList"
                    item-key="id"
                    group="device"
                    v-bind="dragOptions"
                    class="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    <template #item="{ element: deviceItem }">
                      <DeviceCardItem :id="deviceItem.id" :is-drag="!dragOptions.disabled" />
                    </template>
                  </draggable>
                </div>
              </template>
              <van-empty v-else image="search" description="暂无设备">
                <van-button
                  v-if="houseUserPower(currentHouse?.id) != 2"
                  class="!px-6"
                  size="small"
                  plain
                  round
                  @click="goAddDevice"
                >
                  添加设备
                </van-button>
              </van-empty>

              <div v-if="showDragBtn" class="p-6 text-center">
                <van-button class="!px-6" size="small" plain round @click="onDragCancel">
                  {{ dragOptions.disabled ? '编辑' : '取消' }}
                </van-button>
              </div>
            </section>
          </van-tab>
        </van-tabs>
      </div>
    </van-skeleton>
  </div>
</template>

<style scoped lang="scss">
.house-top__placeholder {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}
.house-tabs {
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
}
.house-tabs__hide:deep(.van-tabs__wrap) {
  // display: none !important;
  height: 0 !important;
}
</style>
