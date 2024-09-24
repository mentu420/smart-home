<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import _ from 'lodash'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import { debounce } from '@/utils/common'

import TriggerModePopover from './TriggerModePopover.vue'
import {
  triggerControl,
  isDisabled,
  disabledClass,
  onConfigFormat,
  getModeRange,
  getModeActions,
} from './useTrigger'

const { useGetDeviceItem, includesUse } = deviceStore()

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
const checked = ref(false)
const modeRef = ref(null)

//温度、风俗、模式
const { VALUESWITCH, MODE, TEMPERATURE, SETTEMPERATURE, CURRENTTEMPERATURE, SWITCH } = USE_KEY
const config = ref({
  [SWITCH]: {
    useValue: '0',
    useStatus: 'off',
  },
  [TEMPERATURE]: {
    useValue: 26,
    useStatus: SETTEMPERATURE,
  },
  [SETTEMPERATURE]: 26, //可以控制
  [CURRENTTEMPERATURE]: 25, // 不可控制
  [VALUESWITCH]: {
    useValue: '0',
    useStatus: 'off',
  },
  [MODE]: {
    useValue: '1',
    useStatus: 'auto',
  },
})
const deviceItem = computed(() => useGetDeviceItem(props.id))
const disabled = computed(() => isDisabled(config.value))
const modeActions = computed(() => getModeActions(deviceItem.value, MODE))

watch(
  () => deviceItem.value,
  (val, old) => {
    if (!val) return
    const { modeStatusList, columns } = val
    if (_.isEqual(modeStatusList, old?.modeStatusList)) return
    const [minValue, maxValue] = getModeRange(columns, TEMPERATURE)
    min.value = minValue
    max.value = maxValue
    config.value = onConfigFormat(config.value, modeStatusList)
    config.value[config.value[TEMPERATURE].useStatus] = config.value[TEMPERATURE].useValue
  },
  { immediate: true }
)

const setTemp = debounce(() => {
  config.value[TEMPERATURE] = {
    useStatus: SETTEMPERATURE,
    useValue: config.value[SETTEMPERATURE],
  }
  console.log('debounce', config.value)
  triggerControl({ use: TEMPERATURE, device: deviceItem.value, config: config.value })
}, 1000)

const onLower = () => {
  if (config.value[SETTEMPERATURE] == min.value || disabled.value) return
  --config.value[SETTEMPERATURE]
  setTemp()
}

const onRise = () => {
  if (config.value[SETTEMPERATURE] == max.value || disabled.value) return
  ++config.value[SETTEMPERATURE]
  setTemp()
}

const onModeChange = (use) => {
  triggerControl({ use, device: deviceItem.value, config: config.value })
}

const onValveChange = (value) => {
  if (disabled.value) return
  const useStatus = value ? 'on' : 'off'
  config.value[VALUESWITCH] = { useStatus, useValue: useStatus == 'off' ? '0' : '1' }
  triggerControl({ use: VALUESWITCH, device: deviceItem.value, config: config.value })
}

const toggle = () => {
  const useStatus = config.value[SWITCH].useStatus == 'off' ? 'on' : 'off'
  config.value[SWITCH] = { useStatus, useValue: useStatus == 'off' ? '0' : '1' }
  triggerControl({ use: SWITCH, device: deviceItem.value, config: config.value })
}
</script>

<template>
  <ul class="p-4">
    <li class="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
      <div>
        {{ config[SWITCH]?.useStatus != 'off' ? '已开启' : '已关闭' }}
      </div>
      <div v-if="includesUse(props.id, TEMPERATURE)" class="mr-4 flex-shrink-0 text-center">
        <p>
          <label class="text-lg">{{ config[CURRENTTEMPERATURE] }}</label>
          <label>℃</label>
        </p>
        <p class="text-xs text-gray-400">当前温度</p>
      </div>
      <IconFont
        v-if="includesUse(props.id, SWITCH)"
        :class="config[SWITCH]?.useStatus != 'off' ? 'text-origin' : 'text-gray-300'"
        icon="switch"
        @click="toggle"
      />
    </li>
    <li
      v-if="includesUse(props.id, TEMPERATURE)"
      class="mb-4 flex items-center justify-around rounded-lg bg-white p-3"
      :class="disabledClass(config)"
    >
      <div>
        <van-icon
          :class="{ 'text-gray-300': config[SETTEMPERATURE] == min }"
          name="minus"
          size="20"
          @click="onLower"
        />
      </div>
      <div class="mr-4 flex-shrink-0 text-center">
        <p>{{ config[SETTEMPERATURE] }}℃</p>
        <p class="text-xs text-gray-400">目标温度</p>
      </div>
      <div>
        <van-icon
          :class="{ 'text-gray-300': config[SETTEMPERATURE] == max }"
          name="plus"
          size="20"
          @click="onRise"
        />
      </div>
    </li>
    <div ref="modeRef" class="flex justify-between space-x-4" :class="disabledClass(config)">
      <li
        v-if="includesUse(props.id, VALUESWITCH)"
        class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white px-4"
      >
        <p>阀门开关</p>
        <van-switch v-model="checked" :disabled="disabled" @change="onValveChange" />
      </li>
      <li
        v-if="modeActions?.length > 0"
        class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white"
      >
        <TriggerModePopover
          v-model="config[MODE].useStatus"
          title="模式"
          :actions="modeActions"
          :disabled="disabled"
          @change="onModeChange(MODE)"
        />
      </li>
    </div>
  </ul>
</template>
