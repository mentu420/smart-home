<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { setSceneList } from '@/apis/smartApi'
import useMqtt from '@/hooks/useMqtt'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'

const { mqttScenePublish } = useMqtt()

const props = defineProps({
  isDrag: {
    //是否可以拖拽
    type: Boolean,
    default: false,
  },
  isMore: {
    //是否可以更多编辑
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
})

const router = useRouter()

const actions = [
  { id: 0, text: '编辑', icon: 'setting-o' },
  { id: 1, text: '删除', icon: 'delete-o' },
]
const { sceneList } = storeToRefs(smartStore())
const sceneItem = computed(() => sceneList.value.find((item) => item.id == props.id))
const { houseUserPower, currentHouse } = storeToRefs(houseStore())

const onCardClick = (sceneItem) => {
  if (sceneItem.loading) return
  mqttScenePublish({ id: sceneItem?.id })
}
</script>

<template>
  <div
    class="w-full flex items-center overflow-hidden rounded-lg bg-gray-300 relative"
    :class="{ 'h-[30px]': props.isDrag, 'h-[76px]': !props.isDrag }"
  >
    <SmartImage class="w-full h-full" fit="cover" :src="sceneItem?.img" />
    <div
      v-if="sceneItem?.loading"
      class="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50"
    >
      <van-loading />
    </div>
    <template v-else>
      <div
        class="bg-black bg-opacity-50 p-3 absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center text-white pr-8"
        @click="onCardClick(sceneItem)"
      >
        <slot>
          <label>{{ sceneItem?.label }}</label>
        </slot>
      </div>
      <div class="absolute top-1 right-2 z-10 text-white text-[20px]">
        <van-icon v-if="props.isDrag" name="wap-nav" />
        <template v-else>
          <div v-if="isMore && houseUserPower(currentHouse.id) != 2">
            <van-icon
              class="text-white !text-[20px]"
              name="ellipsis"
              @click.stop="
                router.push({
                  path: '/smart-scene-create',
                  query: { id: sceneItem.id, fenlei: 1 },
                })
              "
            />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
