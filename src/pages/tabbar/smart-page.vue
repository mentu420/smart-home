<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { getSceneList } from '@/apis/smartApi.js'
import ScenenCardItem from '@/components/base/ScenenCardItem.vue'
import houseStore from '@/store/houseStore'
import sceneStore from '@/store/sceneStore'

defineOptions({ name: 'SmartPage' })

const router = useRouter()
const loading = ref(false)
const { roomList } = storeToRefs(houseStore())
const sceneList = ref([{ text: '全局', children: [], id: '' }])

const createSceneItem = () => {
  const { clearSceneCreateItem } = sceneStore()
  clearSceneCreateItem()
  router.push({ path: '/smart-scene-create' })
}

const init = async () => {
  try {
    const { data } = await getSceneList({ op: 1 })
    sceneList.value = [...sceneList.value, ...roomList.value]
      .map((item) => {
        return {
          ...item,
          children: data.filter((option) => option.fangjianbianhao == item.id),
        }
      })
      .filter((item) => item.children.length > 0)
    console.log(sceneList.value)
  } finally {
    loading.value = false
  }
}

init()
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <van-pull-refresh v-model="loading" @refresh="init">
      <van-cell title="我的场景">
        <template #right-icon>
          <van-icon size="20" name="plus" @click="createSceneItem" />
        </template>
      </van-cell>
      <div class="p-4">
        <section v-for="roomItem in sceneList" :key="roomItem.id" class="mb-6">
          <h4 class="mb-2 text-gray-600">{{ roomItem.text }}</h4>
          <div class="grid grid-cols-2 gap-4">
            <ScenenCardItem v-for="sceneItem in roomItem.children" :key="sceneItem.id">
              {{ sceneItem.mingcheng }}
            </ScenenCardItem>
          </div>
        </section>
      </div>
    </van-pull-refresh>
  </div>
</template>
