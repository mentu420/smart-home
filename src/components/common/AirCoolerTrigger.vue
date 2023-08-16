<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  min: {
    type: [Number, String],
    default: 16,
  },
  max: {
    type: [Number, String],
    default: 32,
  },
  modelValue: {
    type: Object,
    default: () => ({ temp: 26, speed: 0, model: 0 }),
  },
})

const speedActions = [
  { id: 0, text: '低风' },
  { id: 1, text: '中风' },
  { id: 2, text: '高风' },
]

const modelActions = [
  { id: 0, text: '制冷', type: 'snowflake' },
  { id: 1, text: '制热', type: 'sun-one' },
  { id: 2, text: '通风', type: 'wind' },
  { id: 3, text: '除湿', type: 'water-level' },
]

const emits = defineEmits(['update:modelValue'])

//温度、风俗、模式
const config = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
})

const modeItem = computed(() => modelActions.find((item) => item.id == config.value.model))
const speedItem = computed(() => speedActions.find((item) => item.id == config.value.speed))

const tempCopy = computed(() => props.modelValue.temp)
const status = ref(false) //空调开关

const setTemp = () =>
  nextTick(() => {
    config.value = { ...config.value, temp: tempCopy.value }
    if (!status.value) status.value = true
  })

const onLower = () => {
  if (tempCopy.value == props.min) return
  --tempCopy.value
  setTemp()
}

const onRise = () => {
  if (tempCopy.value == props.max) return
  ++tempCopy.value
  setTemp()
}

const onSpeedSelect = (action) => {
  if (!status.value) status.value = true
  config.value = { ...config.value, speed: action.id }
}

const onModelSelect = (action) => {
  if (!status.value) status.value = true
  config.value = { ...config.value, model: action.id }
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
      <div>
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full leading-none"
          :class="{ 'bg-theme-color': status }"
          @click="status = !status"
        >
          <IconPark size="24" type="power" theme="filled" :fill="status ? '#fff' : '#999'" />
        </div>
      </div>
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
      <li class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white">
        <van-popover :actions="speedActions" placement="top" @select="onSpeedSelect">
          <template #reference>
            <div class="flex w-40 items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">{{ speedItem.text }}</div>
              <IconPark type="windmill-two" size="1.5em" />
            </div>
          </template>
        </van-popover>
      </li>
      <li class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white">
        <van-popover :actions="modelActions" placement="top" @select="onModelSelect">
          <template #reference>
            <div class="flex w-40 items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">
                <p>模式</p>
                <p class="text-xs text-gray-400">{{ modeItem.text }}</p>
              </div>
              <IconPark :type="modeItem.type" size="1.5em" />
            </div>
          </template>
        </van-popover>
      </li>
    </div>
  </ul>
</template>
