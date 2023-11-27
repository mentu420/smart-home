<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

import { setSmartList } from '@/apis/smartApi'
import ScenenCardItem from '@/components/base/ScenenCardItem.vue'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'

defineOptions({ name: 'SmartPage' })

const router = useRouter()
const loading = ref(false)
const tabActive = ref('0')
const { sceneList, smartList } = storeToRefs(smartStore())
const { roomList, floorList } = storeToRefs(houseStore())

const globalSceneList = ref([])
const roomSceneList = ref([])

const dragOptions = ref({
  animation: 200,
  disabled: true, //是否可以拖拽排序
  ghostClass: 'ghost',
})

function onDrag() {
  dragOptions.value.disabled = !dragOptions.value.disabled
  if (!dragOptions.value.disabled) return
  console.log('globalSceneList', globalSceneList)
  //TODO:排序
  console.log('roomSceneList', roomSceneList)
}

const createSmart = () => {
  const fenlei = tabActive.value == '0' ? 2 : 1
  router.push({ path: '/smart-scene-create', query: { fenlei } })
}

const onRefresh = async () => {
  try {
    loading.value = true
    const { useGetFloorListSync, useGetRoomListSync } = houseStore()
    const { useGetSceneListSync, useGetSmartListSync } = smartStore()
    await Promise.all([
      useGetFloorListSync(true),
      useGetRoomListSync(true),
      useGetSceneListSync(true),
      useGetSmartListSync(true),
    ])
    init()
  } finally {
    loading.value = false
  }
}

const onSmartChange = (value, item) => {
  setSmartList({ params: { op: 6 }, data: { bianhao: item.id, shifouqiyong: value ? 1 : 0 } })
}

const init = () => {
  globalSceneList.value = sceneList.value?.filter((option) => option.rId == '')
  roomSceneList.value = roomList.value
    .map((roomItem) => {
      const floorRes = floorList.value.find((floorItem) => floorItem.id == roomItem.fId)
      return {
        ...roomItem,
        floorName: floorRes?.label,
        floorSort: floorRes?.sort,
        sceneList: sceneList.value.filter((sceneItem) => sceneItem.rId == roomItem.id),
      }
    })
    .filter((item) => item.sceneList.length > 0)
}

onMounted(init)

onActivated(init)
</script>

<template>
  <div class="min-h-[90vh] bg-page-gray">
    <van-pull-refresh
      v-model="loading"
      :disabled="!dragOptions.disabled"
      class="min-h-[60vh]"
      @refresh="onRefresh"
    >
      <van-tabs
        v-model:active="tabActive"
        background="#f7f7f7"
        sticky
        shrink
        line-width="0"
        animated
        :swipeable="dragOptions.disabled"
        @change="init"
      >
        <template #nav-right>
          <div v-if="dragOptions.disabled" class="flex-1 text-right p-3">
            <div class="rounded-lg">
              <van-icon size="20" name="plus" @click="createSmart" />
            </div>
          </div>
        </template>
        <van-tab title="自动化" :disabled="!dragOptions.disabled" name="0">
          <div v-if="smartList.length > 0" class="p-4">
            <section class="mb-6">
              <h4 class="mb-2 text-gray-600">全局</h4>
              <draggable v-model="smartList" item-key="id" group="scene" v-bind="dragOptions">
                <template #item="{ element: smartItem }">
                  <div
                    class="bg-white flex justify-between p-4 w-full rounded-lg items-center mb-4"
                    @click="
                      router.push({
                        path: '/smart-scene-create',
                        query: { id: smartItem.id, fenlei: 2 },
                      })
                    "
                  >
                    <div>{{ smartItem.label }}</div>
                    <van-switch
                      v-model="smartItem.checked"
                      @change="(value) => onSmartChange(value, smartItem)"
                    />
                  </div>
                </template>
              </draggable>
            </section>
          </div>
          <van-empty v-else image="network" description="暂无自动化" />
        </van-tab>
        <van-tab title="场景" :disabled="!dragOptions.disabled" name="1">
          <div class="p-4">
            <section class="mb-6">
              <h4 class="mb-2 text-gray-600">全局</h4>
              <draggable
                v-model="globalSceneList"
                item-key="id"
                group="globalScene"
                v-bind="dragOptions"
                class="grid grid-cols-2 gap-4"
              >
                <template #item="{ element: sceneItem }">
                  <ScenenCardItem
                    :id="sceneItem.id"
                    :is-drag="!dragOptions.disabled"
                    :is-more="dragOptions.disabled"
                  />
                </template>
              </draggable>
            </section>
            <section v-for="roomItem in roomSceneList" :key="roomItem.id" class="mb-6">
              <h4 class="mb-2 text-gray-600">{{ roomItem.floorName }}-{{ roomItem.label }}</h4>
              <draggable
                v-model="roomItem.sceneList"
                item-key="id"
                :group="`${roomItem.id}-scene`"
                v-bind="dragOptions"
                class="grid grid-cols-2 gap-4"
              >
                <template #item="{ element: sceneItem }">
                  <ScenenCardItem
                    :id="sceneItem.id"
                    :is-drag="!dragOptions.disabled"
                    :is-more="dragOptions.disabled"
                  />
                </template>
              </draggable>
            </section>
          </div>
          <div v-if="globalSceneList.length > 0" class="p-6 text-center">
            <van-button class="!px-6" size="small" type="primary" round @click="onDrag">
              {{ dragOptions.disabled ? '编辑' : '完成' }}
            </van-button>
          </div>
        </van-tab>
      </van-tabs>
    </van-pull-refresh>
  </div>
</template>
