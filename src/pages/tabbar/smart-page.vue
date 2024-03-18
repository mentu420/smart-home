<script setup>
import { storeToRefs } from 'pinia'
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

import { setSceneList, setSmartList } from '@/apis/smartApi'
import ScenenCardItem from '@/pages/tabbar/components/ScenenCardItem.vue'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'

defineOptions({ name: 'SmartPage' })

const router = useRouter()
const loading = ref(false)
const tabActive = ref(2)
const { sceneList, smartList } = storeToRefs(smartStore())
const { roomList, floorList, houseUserPower, currentHouse } = storeToRefs(houseStore())
const isTabsFixed = ref(false)
const globalSceneList = ref([])
const roomSceneList = ref([])

const dragOptions = ref({
  animation: 200,
  disabled: true, //是否可以拖拽排序
  ghostClass: 'ghost',
})

const showDrag = computed(() => {
  return tabActive.value == 2 ? smartList.value?.length > 0 : sceneList.value?.length > 0
})

const onSceneListSort = (data) => setSceneList({ params: { op: 7 }, data })

async function onDragEnd() {
  dragOptions.value.disabled = !dragOptions.value.disabled
  if (!dragOptions.value.disabled) return
  if (tabActive.value == 2) {
    //setSmartList
    await setSmartList({
      params: { op: 7 },
      data: smartList.value.map((item, i) => ({
        changjingbianhao: item.id,
        paixu: i,
      })),
    })
  } else {
    await onSceneListSort(
      globalSceneList.value.map((item, i) => ({
        changjingbianhao: item.id,
        paixu: i,
      }))
    )
    await Promise.all(
      roomSceneList.value.map(async (roomItem) => {
        return await onSceneListSort(
          roomItem.sceneList.map((item, i) => ({
            changjingbianhao: item.id,
            paixu: i,
          }))
        )
      })
    )
  }
}

const createSmart = () => {
  const fenlei = tabActive.value
  router.push({ path: '/smart-scene-create', query: { fenlei } })
}

const onSmartChange = (value, item) => {
  setSmartList({ params: { op: 6 }, data: { bianhao: item.id, shifouqiyong: value ? 1 : 0 } })
}

const editSmartItem = (smartItem) => {
  router.push({
    path: '/smart-scene-create',
    query: { id: smartItem.id, fenlei: 2 },
  })
}

const init = () => {
  dragOptions.value.disabled = true
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
  <div class="min-h-screen bg-page-gray p-safe">
    <section class="bg-page-gray fixed left-0 right-0 smart-tabs z-10">
      <div class="flex justify-between items-center px-4 py-3">
        <ul class="flex items-center text-[16px] space-x-4">
          <li
            v-if="houseUserPower(currentHouse.id) != 2"
            :class="{ 'font-bold': tabActive == 2 }"
            @click="tabActive = '2'"
          >
            自动化
          </li>
          <li :class="{ 'font-bold': tabActive == 1 }" @click="tabActive = '1'">场景</li>
        </ul>
        <div class="flex-1 text-right">
          <div
            v-if="dragOptions.disabled && houseUserPower(currentHouse.id) != 2"
            class="rounded-lg"
          >
            <van-icon size="20" name="plus" @click="createSmart" />
          </div>
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
        </div>
      </div>
    </section>

    <div class="fixed left-0 right-0 top-0 smart-tab__placeholder bg-page-gray z-[5]"></div>
    <div class="h-[45px]"></div>

    <van-tabs
      v-model:active="tabActive"
      class="smart-tabs__hide"
      background="#f7f7f7"
      sticky
      shrink
      line-width="0"
      animated
      :swipeable="dragOptions.disabled"
      @change="init"
    >
      <van-tab
        v-if="houseUserPower(currentHouse.id) != 2"
        title="自动化"
        :disabled="!dragOptions.disabled"
        name="2"
      >
        <div v-if="smartList.length > 0" class="p-4">
          <section class="mb-6">
            <h4 class="mb-2 text-gray-600">全局</h4>
            <draggable v-model="smartList" item-key="id" group="scene" v-bind="dragOptions">
              <template #item="{ element: smartItem }">
                <div
                  class="bg-white flex justify-between p-4 w-full rounded-lg items-center mb-4"
                  @click="editSmartItem(smartItem)"
                >
                  <div>{{ smartItem.label }}</div>
                  <van-icon v-if="!dragOptions.disabled" name="wap-nav" />
                  <van-switch
                    v-else
                    v-model="smartItem.shifouqiyong"
                    :active-value="1"
                    :inactive-value="0"
                    @click.stop
                    @change="(value) => onSmartChange(value, smartItem)"
                  />
                </div>
              </template>
            </draggable>
          </section>
        </div>
        <van-empty v-else description="暂无自动化" />
      </van-tab>
      <van-tab title="场景" :disabled="!dragOptions.disabled" name="1">
        <div class="p-4">
          <section v-if="globalSceneList.length > 0" class="mb-6">
            <h4 class="mb-2 text-gray-600">全局</h4>
            <draggable
              v-model="globalSceneList"
              item-key="id"
              group="globalScene"
              v-bind="dragOptions"
              class="grid grid-cols-2 md:grid-cols-4 gap-4"
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
            <h4 class="mb-2 text-gray-600">{{ roomItem.floorName }} - {{ roomItem.label }}</h4>
            <draggable
              v-model="roomItem.sceneList"
              item-key="id"
              :group="`${roomItem.id}-scene`"
              v-bind="dragOptions"
              class="grid grid-cols-2 md:grid-cols-4 gap-4"
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
          <van-empty
            v-if="globalSceneList.length == 0 && roomSceneList.length == 0"
            description="暂无场景"
          />
        </div>
      </van-tab>
    </van-tabs>
    <div v-if="showDrag" class="p-6 text-center">
      <van-button
        class="!px-6"
        size="small"
        round
        plain
        @click="dragOptions.disabled = !dragOptions.disabled"
      >
        {{ dragOptions.disabled ? '编辑' : '取消' }}
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.smart-tabs {
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
}

.smart-tab__placeholder {
  height: calc(constant(safe-area-inset-top) + 45px);
  height: calc(env(safe-area-inset-top) + 45px);
}
.smart-tabs__hide:deep(.van-tabs__wrap) {
  display: none !important;
}
</style>
