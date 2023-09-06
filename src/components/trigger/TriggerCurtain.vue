<script setup>
import { ref, computed, watch } from 'vue'

import deviceStore from '@/store/deviceStore'
const { useGetDeviceItem, deviceUseList } = deviceStore()

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const deviceItem = ref({})

const degree = ref(0)

const theme = '#e39334'
const pause = ref(true)
const open = ref(false)
const close = ref(false)

const toggle = () => {
  pause.value = true
  open.value = false
  close.value = false
}

const onLower = () => {
  pause.value = false
  close.value = true
  open.value = false
}

const onIncrease = () => {
  pause.value = false
  open.value = true
  close.value = false
}

watch(
  () => props.id,
  async (val) => {
    if (!val) return
    deviceItem.value = await useGetDeviceItem(val)
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <van-cell-group style="background: transparent" inset :border="false">
    <van-cell class="mt-4 rounded-xl" center :border="false">
      <template #icon>
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full"
          :class="{ 'bg-gray-400': !close, 'bg-primary': close }"
        >
          <iconpark-icon
            ref="iconRef"
            size="1.2em"
            name="tubiao-chuanglian"
            color="#fff"
            @click="onLower"
          ></iconpark-icon>
        </span>
      </template>
      <div class="flex items-center justify-center leading-none">
        <IconPark
          :type="pause ? 'pause-one' : 'play'"
          theme="filled"
          size="2.5em"
          :fill="pause ? '#969799' : theme"
          @click="toggle"
        />
      </div>
      <template #right-icon>
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full"
          :class="{ 'bg-gray-400': !open, 'bg-primary': open }"
        >
          <iconpark-icon
            ref="iconRef"
            size="1.2em"
            name="chuanglianguanbi"
            color="#fff"
            @click="onIncrease"
          ></iconpark-icon>
        </span>
      </template>
    </van-cell>
    <van-cell
      v-if="deviceUseList(props.id)?.includes('percent')"
      class="mt-4 rounded-xl"
      center
      title="开合度"
      :label="`${degree}%`"
      :border="false"
      title-style="flex:0 0 auto"
    >
      <div class="h-10 p-4 pl-8">
        <van-slider v-model="degree" />
      </div>
    </van-cell>
  </van-cell-group>
</template>
