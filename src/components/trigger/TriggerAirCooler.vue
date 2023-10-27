<script setup>
import { useRect } from '@vant/use'
import { storeToRefs } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'

import { USE_KEY } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { throttle } from '@/utils/common'

import TriggerModePopover from './TriggerModePopover.vue'
import { useTrigger } from './useTrigger'

const { useGetDeviceItem } = deviceStore()

const { triggerControl, disabledClass, isDisabled, getModeActions, onConfigFormat, getModeRange } =
  useTrigger()

const { FAN, MODE, TEMPERATURE, SWITCH } = USE_KEY

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  // 是否作为触发器使用
  isUse: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['change', 'update:modelValue'])

const max = ref(32)
const min = ref(16)
const modeRef = ref(null)

//温度、风俗、模式
const config = ref({
  [SWITCH]: {
    useValue: '0',
    useStatus: 'off',
  },
  [TEMPERATURE]: {
    useValue: 26,
    useStatus: TEMPERATURE,
  },
  [FAN]: {
    useValue: '1',
    useStatus: 'auto',
  },
  [MODE]: {
    useValue: '1',
    useStatus: 'auto',
  },
})
const deviceItem = computed(() => useGetDeviceItem(props.id))
const disabled = computed(() => isDisabled(config.value))
watch(
  () => deviceItem.value,
  (val) => {
    const { modeList, columns } = val
    const [minValue, maxValue] = getModeRange(columns, TEMPERATURE)
    min.value = minValue
    max.value = maxValue
    config.value = onConfigFormat(config.value, modeList)
  },
  { immediate: true }
)
const tempCopy = ref(config.value[TEMPERATURE])
const speedActions = computed(() => getModeActions(deviceItem.value, FAN))
const modeActions = computed(() => getModeActions(deviceItem.value, MODE))

const setTemp = () => {
  if (config.value[SWITCH].useStatus == 'off') return
  nextTick(() => {
    config.value[TEMPERATURE] = { ...config.value[TEMPERATURE], useValue: tempCopy.value.useValue }
    triggerControl(TEMPERATURE, deviceItem.value, config.value)
  })
}

const onLower = () => {
  if (tempCopy.value.useValue == min.value || disabled.value) return
  --tempCopy.value.useValue
  setTemp()
}

const onRise = () => {
  if (disabled.value) return
  if (tempCopy.value.useValue == max.value) return
  ++tempCopy.value.useValue
  setTemp()
}

const onModeChange = (use) => {
  triggerControl(use, deviceItem.value, config.value)
}

const toggle = () => {
  const useStatus = config.value[SWITCH].useStatus == 'off' ? 'on' : 'off'
  config.value[SWITCH] = { useStatus, useValue: useStatus == 'off' ? '0' : '1' }
  triggerControl(SWITCH, deviceItem.value, config.value)
}
</script>

<template>
  <ul class="p-4">
    <li class="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
      <div>
        {{ config[SWITCH]?.useStatus != 'off' ? '已开启' : '已关闭' }}
      </div>
      <div class="mr-4 flex-shrink-0 text-center">
        <p>
          <label class="text-lg">{{ config[TEMPERATURE].useValue }}</label>
          <label>℃</label>
        </p>
        <p class="text-xs text-gray-400">当前温度</p>
      </div>
      <IconFont
        :class="config[SWITCH]?.useStatus != 'off' ? 'text-primary' : 'text-gray-300'"
        icon="switch"
        @click="toggle"
      />
    </li>
    <li
      class="mb-4 flex items-center justify-around rounded-lg bg-white p-3"
      :class="disabledClass(config)"
    >
      <div>
        <van-icon
          :class="{ 'text-gray-300': tempCopy.useValue == min }"
          name="minus"
          size="20"
          @click="onLower"
        />
      </div>
      <div class="mr-4 flex-shrink-0 text-center">
        <p>{{ tempCopy.useValue }}℃</p>
        <p class="text-xs text-gray-400">目标温度</p>
      </div>
      <div>
        <van-icon
          :class="{ 'text-gray-300': tempCopy.useValue == max }"
          name="plus"
          size="20"
          @click="onRise"
        />
      </div>
    </li>
    <div ref="modeRef" class="flex justify-between space-x-4" :class="disabledClass(config)">
      <template
        v-for="modeItem in [
          { title: '风速', use: FAN, actions: speedActions },
          { title: '模式', use: MODE, actions: modeActions },
        ]"
        :key="modeItem.use"
      >
        <li
          v-if="modeItem.actions?.length > 0"
          class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white"
        >
          <TriggerModePopover
            v-model="config[modeItem.use].useStatus"
            :actions="modeItem.actions"
            :disabled="disabled"
            :title="modeItem.title"
            @change="onModeChange(modeItem.use)"
          />
        </li>
      </template>
    </div>
  </ul>
</template>
