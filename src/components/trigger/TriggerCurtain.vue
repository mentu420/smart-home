<script setup>
import { ref, computed, watch } from 'vue'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import _ from 'lodash'

import {
  getModeColumns,
  triggerControl,
  isOfflineDevice,
  onConfigFormat,
  getModeRange,
} from './useTrigger'

const { useGetDeviceItem, includesUse, useDeviceItemChange } = deviceStore()

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

const min = ref(0)
const max = ref(100)
const deviceItem = computed(() => useGetDeviceItem(props.id))
const { STOP, PERCENT, ANGLE, SWITCH } = USE_KEY
const config = ref({
  [SWITCH]: {
    useValue: '0',
    useStatus: 'off',
  },
  [STOP]: {
    useValue: '1',
    useStatus: STOP,
  },
  [PERCENT]: {
    useValue: 1,
    useStatus: PERCENT,
  },
  [ANGLE]: {
    useValue: 1,
    useStatus: ANGLE,
  },
})

watch(
  () => deviceItem.value,
  (val, old) => {
    if (!val) return
    const { modeStatusList, columns } = val
    if (_.isEqual(modeStatusList, old?.modeStatusList)) return
    const [minValue, maxValue] = getModeRange(columns, PERCENT)
    min.value = minValue
    max.value = maxValue
    config.value = onConfigFormat(config.value, modeStatusList)
  },
  { immediate: true }
)

const onStopToggle = () => {
  if (isOfflineDevice(deviceItem)) return

  triggerControl({ use: STOP, device: deviceItem.value, config: config.value })
}

const onSwitch = (useValue) => {
  if (isOfflineDevice(deviceItem)) return
  config.value[SWITCH] = { useStatus: useValue == '0' ? 'off' : 'on', useValue }
  triggerControl({ use: SWITCH, device: deviceItem.value, config: config.value })
}

const onPercentChange = () => {
  if (isOfflineDevice(deviceItem)) return
  triggerControl({ use: PERCENT, device: deviceItem.value, config: config.value })
}
</script>

<template>
  <div class="p-4">
    <van-cell-group style="background: transparent" :border="false">
      <van-cell class="rounded-xl" center :border="false">
        <template #icon>
          <IconFont
            v-clickable-active="{ color: '#e39334' }"
            class="text-gray-400"
            icon="curtain-off"
            @click="onSwitch('0')"
          />
        </template>
        <div
          v-clickable-active="{ color: '#e39334' }"
          class="flex items-center justify-center leading-none"
        >
          <IconFont icon="stop" @click="onStopToggle" />
        </div>

        <template #right-icon>
          <IconFont
            v-clickable-active="{ color: '#e39334' }"
            class="text-gray-400"
            icon="curtain-on"
            @click="onSwitch('1')"
          />
        </template>
      </van-cell>
      <template
        v-for="(modeLabel, modeKey) in { [PERCENT]: '开合度', [ANGLE]: '角度' }"
        :key="modeKey"
      >
        <van-cell
          v-if="includesUse(props.id, modeKey)"
          class="mt-4 rounded-xl"
          center
          :title="modeLabel"
          :label="`${config[modeKey].useValue}%`"
          :border="false"
          title-style="flex:0 0 auto"
        >
          <div class="h-10 p-4 pl-8">
            <van-slider
              v-model="config[modeKey].useValue"
              :min="min"
              :max="max"
              @change="onPercentChange"
            />
          </div>
        </van-cell>
      </template>
    </van-cell-group>
  </div>
</template>
