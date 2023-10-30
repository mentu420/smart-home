<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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

const createSceneItem = () => {
  router.push({ path: '/smart-scene-create' })
}

function onEditScene(item) {
  router.push({ path: '/smart-scene-create', query: { id: item.id } })
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
          <div class="grid grid-cols-2 gap-4">
            <ScenenCardItem
              v-for="sceneItem in globalSceneList"
              :key="sceneItem.id"
              is-edit
              @click="mqttScenePublish({ id: sceneItem.id })"
            >
              {{ sceneItem.mingcheng }}
              <div
                class="absolute right-0 top-0 text-white px-3 py-1"
                @click.stop="onEditScene(sceneItem)"
              >
                <van-icon name="ellipsis" />
              </div>
            </ScenenCardItem>
          </div>
        </section>
        <section v-for="floorItem in smartList" :key="floorItem.id" class="mb-6">
          <h4 class="mb-2 text-gray-600">{{ floorItem.label }}</h4>
          <div v-for="roomItem in floorItem.roomList" :key="roomItem.id">
            <h4 class="mb-2 text-gray-600">{{ roomItem.label }}</h4>
            <div class="grid grid-cols-2 gap-4">
              <ScenenCardItem
                v-for="sceneItem in roomItem.sceneList"
                :key="sceneItem.id"
                is-edit
                @click.stop="mqttScenePublish({ id: sceneItem.id })"
              >
                {{ sceneItem.mingcheng }}
                <div
                  class="absolute right-0 top-0 text-white px-3 py-1"
                  @click="onEditScene(sceneItem)"
                >
                  <van-icon name="ellipsis" />
                </div>
              </ScenenCardItem>
            </div>
          </div>
        </section>
      </div>
    </van-pull-refresh>
  </div>
</template>
