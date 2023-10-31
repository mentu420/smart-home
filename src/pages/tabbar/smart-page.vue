<script setup>
import { storeToRefs } from 'pinia'
import { showConfirmDialog } from 'vant'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

import { setSceneList } from '@/apis/smartApi'
import ScenenCardItem from '@/components/base/ScenenCardItem.vue'
import useMqtt from '@/hooks/useMqtt'
import houseStore from '@/store/houseStore'
import sceneStore from '@/store/sceneStore'

defineOptions({ name: 'SmartPage' })

const router = useRouter()
const { mqttScenePublish } = useMqtt()
const loading = ref(false)
const { sceneList } = storeToRefs(sceneStore())
const globalSceneList = computed(() => sceneList.value?.filter((option) => option.rId == ''))
const smartList = ref([])
const dragOptions = ref({
  animation: 200,
  disabled: true, //是否可以拖拽排序
  ghostClass: 'ghost',
})

const sceneActions = computed(() => (item) => {
  return [
    { id: 0, text: '编辑', icon: 'setting-o' },
    { id: 1, text: '删除', icon: 'delete-o' },
    {
      id: 2,
      text: item.collect ? '已收藏' : '收藏',
      icon: item.collect ? 'like' : 'like-o',
      className: item.collect ? 'text-[#e39334]' : null,
    },
  ]
})

const createSceneItem = () => {
  router.push({ path: '/smart-scene-create' })
}

async function onMoreSelect(action, item) {
  const { useGetSceneListSync } = sceneStore()
  if (action.id == 0) {
    router.push({ path: '/smart-scene-create', query: { id: item.id } })
  } else if (action.id == 1) {
    try {
      await showConfirmDialog({ title: '提示', message: `是否删除${item.label}场景？` })
      await setSceneList({ params: { op: 4, changjingbianhao: item.id } })
      useGetSceneListSync(true)
    } catch (error) {
      //
    }
  } else if (action.id == 2) {
    const leixing = item.collect ? 2 : 1
    await setSceneList({
      params: { op: 5 },
      data: { changjingbianhao: item.id, leixing, paixu: item.sort },
    })
    useGetSceneListSync(true)
  }
}

const onRefresh = async () => {
  try {
    loading.value = true
    const { useGetFloorListSync, useGetRoomListSync } = houseStore()
    const { useGetSceneListSync } = sceneStore()
    await Promise.all([
      useGetFloorListSync(true),
      useGetRoomListSync(true),
      useGetSceneListSync(true),
    ])
    init()
  } finally {
    loading.value = false
  }
}

const init = () => {
  const { useGetFloorTree } = houseStore()
  const floorList = useGetFloorTree()
  console.log(floorList)
  smartList.value = floorList.map((floorItem) => {
    return floorItem.roomList.some((roomItem) => roomItem.sceneList.length > 0)
  })
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <van-pull-refresh v-model="loading" class="min-h-[80vh]" @refresh="onRefresh">
      <van-sticky>
        <van-cell title="我的场景">
          <template #right-icon>
            <van-icon size="20" name="plus" @click="createSceneItem" />
          </template>
        </van-cell>
      </van-sticky>
      <div class="p-4">
        <section class="mb-6">
          <h4 class="mb-2 text-gray-600">全局</h4>
          <draggable
            v-model="globalSceneList"
            item-key="id"
            group="scene"
            v-bind="dragOptions"
            class="grid grid-cols-2 gap-4"
          >
            <template #item="{ element: sceneItem }">
              <div class="relative">
                <ScenenCardItem is-edit @click="mqttScenePublish({ id: sceneItem.id })">
                  {{ sceneItem.mingcheng }}
                </ScenenCardItem>
                <div class="absolute right-0 top-0 text-white px-3 py-1 z-10">
                  <van-icon v-if="!dragOptions.disabled" name="wap-nav" />
                  <van-popover
                    v-else
                    :actions="sceneActions(sceneItem)"
                    placement="left"
                    @select="(action) => onMoreSelect(action, sceneItem)"
                  >
                    <template #reference>
                      <van-icon name="ellipsis" />
                    </template>
                  </van-popover>
                </div>
              </div>
            </template>
          </draggable>
        </section>
        <section v-for="floorItem in smartList" :key="floorItem.id" class="mb-6">
          <h4 class="mb-2 text-gray-600">{{ floorItem.label }}</h4>
          <div v-for="roomItem in floorItem.roomList" :key="roomItem.id">
            <h4 class="mb-2 text-gray-600">{{ roomItem.label }}</h4>
            <div class="grid grid-cols-2 gap-4">
              <!-- <draggable
              v-model="roomItem.sceneList"
              item-key="id"
              group="scene"
              v-bind="dragOptions"
              class="grid grid-cols-2 gap-4"
            > -->
              <div v-for="sceneItem in roomItem.sceneList" :key="sceneItem.id" class="relative">
                <ScenenCardItem is-edit @click.stop="mqttScenePublish({ id: sceneItem.id })">
                  {{ sceneItem.mingcheng }}
                </ScenenCardItem>
                <div class="absolute right-0 top-0 text-white px-3 py-1 z-10">
                  <van-popover
                    :actions="sceneActions(sceneItem)"
                    placement="left"
                    @select="(action) => onMoreSelect(action, sceneItem)"
                  >
                    <template #reference>
                      <van-icon name="ellipsis" />
                    </template>
                  </van-popover>
                </div>
              </div>
              <!-- </draggable> -->
            </div>
          </div>
        </section>
      </div>
      <div v-if="globalSceneList.length > 0" class="p-6 text-center">
        <van-button
          class="!px-6"
          size="small"
          type="primary"
          round
          @click="dragOptions.disabled = !dragOptions.disabled"
        >
          {{ dragOptions.disabled ? '编辑' : '完成' }}
        </van-button>
      </div>
    </van-pull-refresh>
  </div>
</template>
