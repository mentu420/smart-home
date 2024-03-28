<script setup>
import { useEventListener } from '@vant/use'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { CLASSIFY_EXECL } from '@/enums/deviceEnums'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'

defineOptions({ name: 'SmartTaskSceneList' })

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const filterRef = ref(null)
const floorTree = ref([]) // 楼层数据
const checkedScene = ref([]) // 选择场景
const checkedRoom = ref([]) // 房间
const { sceneList, createSmartItem } = storeToRefs(smartStore())
const checkboxRefs = ref([])
const allScene = ref(false)

// 获取已经存在的场景
const getSelectSceneList = () => {
  const { smartType } = route.query
  return createSmartItem.value[smartType]?.filter((item) => item.ziyuanleixing == 2) || []
}

const toggle = (index) => {
  checkboxRefs.value[index].toggle()
}

const isAll = (fId) => {
  const allIds = floorTree.value
    .find((item) => item.id == fId)
    .roomList.map((roomItem) => roomItem.id)
  return allIds.every((id) => checkedRoom.value.includes(id))
}

const searchList = computed(() => {
  return checkedRoom.value.length == 0
    ? sceneList.value
    : sceneList.value.filter((item) => checkedRoom.value.includes(item.rId))
})

const selectRoomItem = (rId) => {
  if (checkedRoom.value.includes(rId)) {
    checkedRoom.value = checkedRoom.value.filter((id) => id != rId)
  } else {
    checkedRoom.value = [...checkedRoom.value, rId]
  }
}

const onFloorSelectRoom = (fId) => {
  const allIds = floorTree.value
    .find((item) => item.id == fId)
    .roomList.map((roomItem) => roomItem.id)
  if (isAll(fId)) {
    checkedRoom.value = checkedRoom.value.filter((id) => !allIds.includes(id))
  } else {
    checkedRoom.value = [...new Set([...checkedRoom.value, ...allIds])]
  }
}

const onRefresh = async () => {
  try {
    loading.value = true
    const { useGetRoomListSync, useGetFloorListSync } = houseStore()
    const { useGetSceneListSync } = smartStore()
    await Promise.all([
      useGetRoomListSync(true),
      useGetFloorListSync(true),
      useGetSceneListSync(true),
    ])
    init()
  } finally {
    loading.value = false
  }
}

const onRest = () => {
  checkedRoom.value = []
}

watch(
  () => checkedScene.value,
  (val) => {
    allScene.value = val.length > 0 && val.length == searchList.value.length
  }
)

const selectAllScene = () => {
  allScene.value = !allScene.value
  checkedScene.value = allScene.value ? searchList.value.map((item) => item.id) : []
}

const onSave = () => {
  // //ziyuanleixing 资源类型 1，设备；2，场景
  const { smartType } = route.query
  const deviceActions =
    createSmartItem.value[smartType]?.filter((item) => item.ziyuanleixing == 1) || []

  // 已经选择了的场景
  const list = getSelectSceneList()
  // 新选择的场景
  const checkList = sceneList.value.filter((item) => checkedScene.value.includes(item.id))
  // 最终选择的场景id
  const ids = [...new Set([...list, ...checkList].map((item) => item.id))]
  // 合并成新的场景列表
  const newSceneList = ids
    .map((id) => sceneList.value.find((item) => item.id == id))
    .map((item) => {
      const option = list.find((option) => option.id == item.id) || {}
      return { ...item, ziyuanleixing: 2, ...option }
    })

  createSmartItem.value = {
    ...createSmartItem.value,
    [smartType]: [...deviceActions, ...newSceneList],
  }
  router.goBack(-2)
}

const init = () => {
  const { useGetFloorTree } = houseStore()
  const floorList = useGetFloorTree()
  floorTree.value = floorList.filter((item) => item.roomList.length > 0)
  const list = getSelectSceneList()
  checkedScene.value = list.map((item) => item.id)
}

init()
</script>

<template>
  <div class="bg-page-gray">
    <HeaderNavbar title="场景列表">
      <template #right>
        <van-button size="small" type="gray" :disabled="checkedScene.length == 0" @click="onSave">
          保存
        </van-button>
      </template>
    </HeaderNavbar>
    <van-pull-refresh v-model="loading" class="min-h-screen" @refresh="onRefresh">
      <div class="flex items-center justify-between p-4">
        <p class="text-gray-500">选择希望控制的设备</p>
        <div class="flex justify-center items-center">
          <van-dropdown-menu class="filter-bar">
            <van-dropdown-item ref="filterRef" title="筛选">
              <ul class="min-h-full p-4">
                <li class="mb-6">
                  <div v-for="floorItem in floorTree" :key="floorItem.id">
                    <h4 class="mb-4">{{ floorItem.label }}</h4>
                    <div>
                      <van-button
                        class="!mb-4 !mr-4"
                        round
                        size="small"
                        :type="isAll(floorItem.id) ? 'primary' : 'default'"
                        @click="onFloorSelectRoom(floorItem.id)"
                      >
                        <p class="px-4">
                          {{ isAll(floorItem.id) ? '取消' : '全部' }}
                        </p>
                      </van-button>
                      <van-button
                        v-for="roomItem in floorItem.roomList"
                        :key="roomItem.id"
                        class="!mb-2 !mr-2"
                        round
                        size="small"
                        :type="checkedRoom.includes(roomItem.id) ? 'primary' : 'default'"
                        @click="selectRoomItem(roomItem.id)"
                      >
                        <p class="px-4">{{ roomItem.label }}</p>
                      </van-button>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="h-[80px]"></div>
              <div class="fixed bottom-0 left-0 flex w-screen space-x-4 p-4">
                <van-button block round type="smart" @click="onRest">重置</van-button>
                <van-button block round plain @click="filterRef.toggle()">确认</van-button>
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
          <van-button class="!ml-6" size="small" round @click="selectAllScene">
            {{ allScene ? '取消' : '全选' }}
          </van-button>
        </div>
      </div>
      <van-checkbox-group v-model="checkedScene">
        <van-cell-group inset>
          <van-cell
            v-for="(searchItem, index) in searchList"
            :key="searchItem.id"
            clickable
            :title="searchItem.label"
            @click="toggle(index)"
          >
            <template #right-icon>
              <van-checkbox
                :ref="(el) => (checkboxRefs[index] = el)"
                :name="searchItem.id"
                @click.stop
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-pull-refresh>
  </div>
</template>

<style scoped lang="scss">
.filter-bar:deep(.van-dropdown-menu__bar) {
  background: transparent;
  box-shadow: none;
}
.filter-bar:deep(.van-dropdown-item__content) {
  min-height: 100%;
}
</style>
