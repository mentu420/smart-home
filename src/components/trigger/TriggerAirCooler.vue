<script setup>
import { ref, computed, watch, nextTick } from 'vue'

import deviceStore from '@/store/deviceStore'

const { useGetDeviceItem, deviceUseList } = deviceStore()

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
})

const deviceItem = computed(() => useGetDeviceItem(props.id))

const max = ref(32)
const min = ref(16)

const speedActions = computed(() => deviceItem.value?.columns.filter((item) => item.use == 'fan'))

const modelActions = computed(() => deviceItem.value?.columns.filter((item) => item.use == 'mode'))

const emits = defineEmits(['update:modelValue'])

//温度、风俗、模式
const config = ref({ temp: 26, speed: 0, model: 0 })

const modeItem = computed(() =>
  modelActions.value?.find((item) => item.useEn == config.value.model)
)
const speedItem = computed(() =>
  speedActions.value?.find((item) => item.useEn == config.value.speed)
)

const tempCopy = ref(config.value.temp)
const status = ref(false) //空调开关

const setTemp = () =>
  nextTick(() => {
    config.value = { ...config.value, temp: tempCopy.value }
    if (!status.value) status.value = true
  })

const onLower = () => {
  if (tempCopy.value == min.value) return
  --tempCopy.value
  setTemp()
}

const onRise = () => {
  if (tempCopy.value == max.value) return
  ++tempCopy.value
  setTemp()
}

const onSpeedSelect = (action) => {
  if (!status.value) status.value = true
  config.value = { ...config.value, speed: action.id }
}

const onModelSelect = (action) => {
  if (!status.value) status.value = true
  config.value = { ...config.value, model: action.useEn }
}
</script>

<template>
  <ul class="p-4">
    <li class="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
      <div>
        {{ status ? '已开启' : '已关闭' }}
      </div>
      <div class="mr-4 flex-shrink-0 text-center">
        <p>
          <label class="text-lg">{{ config.temp }}</label>
          <label>℃</label>
        </p>
        <p class="text-xs text-gray-400">当前温度</p>
      </div>
      <IconFont
        :class="status ? 'text-primary' : 'text-gray-300'"
        icon="switch"
        @click="status = !status"
      />
    </li>
    <li class="mb-4 flex items-center justify-around rounded-lg bg-white p-3">
      <div>
        <van-icon name="minus" size="20" @click="onLower" />
      </div>
      <div class="mr-4 flex-shrink-0 text-center">
        <p>{{ tempCopy }}℃</p>
        <p class="text-xs text-gray-400">目标温度</p>
      </div>
      <div>
        <van-icon name="plus" size="20" @click="onRise" />
      </div>
    </li>
    <div class="flex justify-between space-x-4">
      <li
        v-if="speedActions?.length > 0"
        class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white"
      >
        <van-popover :actions="speedActions" placement="top" @select="onSpeedSelect">
          <template #reference>
            <div class="flex w-40 items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">{{ speedItem?.useCn }}</div>
              <IconPark type="windmill-two" size="1.5em" />
            </div>
          </template>
        </van-popover>
      </li>
      <li
        v-if="modelActions?.length > 0"
        class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white"
      >
        <van-popover :actions="modelActions" placement="top" @select="onModelSelect">
          <template #reference>
            <div class="flex w-40 items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">
                <p>模式</p>
                <p class="text-xs text-gray-400">{{ modeItem?.useCn }}</p>
              </div>
              <IconPark :type="modeItem?.type" size="1.5em" />
            </div>
          </template>
        </van-popover>
      </li>
    </div>
  </ul>
</template>
