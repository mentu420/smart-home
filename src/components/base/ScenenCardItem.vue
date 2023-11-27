<script setup>
import { storeToRefs } from 'pinia'
import { showConfirmDialog } from 'vant'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { setSceneList } from '@/apis/smartApi'
import image1 from '@/assets/images/smart/smart-bg-1.jpg'
import useMqtt from '@/hooks/useMqtt'
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

async function onMoreSelect(action, item) {
  if (action.id == 0) {
    router.push({ path: '/smart-scene-create', query: { id: item.id, fenlei: 1 } })
  } else if (action.id == 1) {
    try {
      await showConfirmDialog({ title: '提示', message: `是否删除${item.label}场景？` })
      await setSceneList({ params: { op: 4, changjingbianhao: item.id } })
      sceneList.value = sceneList.value.filter((sceneItem) => sceneItem.id != item.id)
    } catch (error) {
      //
    }
  }
}

async function onCollect(item) {
  const leixing = item.collect ? 2 : 1
  await setSceneList({
    params: { op: 5 },
    data: { changjingbianhao: item.id, leixing, paixu: item.sort },
  })
  sceneList.value = sceneList.value.map((sceneItem) => {
    if (sceneItem.id == item.id) return { ...item, collect: leixing != 2 }
    return sceneItem
  })
}
</script>

<template>
  <dl class="w-full flex items-center overflow-hidden rounded-lg bg-gray-300 h-[76px] relative">
    <van-image class="w-full h-full" fit="cover" :src="sceneItem?.img">
      <template #error>
        <van-image class="w-full h-full" fit="cover" :src="image1" />
      </template>
    </van-image>
    <dt
      v-clickable-active
      class="bg-black bg-opacity-50 p-3 absolute top-0 right-0 left-0 bottom-0 flex flex-row items-center text-white pr-8"
      @click="mqttScenePublish({ id: sceneItem?.id })"
    >
      <slot>
        <label>{{ sceneItem?.label }}</label>
      </slot>
    </dt>
    <dd class="absolute top-1 right-2 z-10 text-white text-[20px]">
      <van-icon v-if="props.isDrag" name="wap-nav" />
      <template v-else>
        <van-icon
          :name="sceneItem?.collect ? 'like' : 'like-o'"
          :class="sceneItem?.collect ? 'text-[#e39334]' : null"
          @click.stop="onCollect(sceneItem)"
        />
      </template>
    </dd>
    <dd v-if="isMore" class="absolute bottom-1 right-2 z-10">
      <van-popover
        :actions="actions"
        placement="left"
        @select="(action) => onMoreSelect(action, sceneItem)"
      >
        <template #reference>
          <van-icon class="text-white !text-[20px]" name="ellipsis" />
        </template>
      </van-popover>
    </dd>
  </dl>
</template>
