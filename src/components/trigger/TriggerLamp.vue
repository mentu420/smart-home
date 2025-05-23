<script setup>
import { ref, reactive, computed, watch } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import { stringToArray } from '@/utils/common'
import _ from 'lodash'

import {
  triggerControl,
  isOfflineDevice,
  disabledClass,
  isDisabled,
  onConfigFormat,
  getModeRange,
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

const emits = defineEmits(['update:modelValue', 'update:hue', 'change'])

const { COLOURTEMPERATURE, BRIGHTNESS, SWITCH } = USE_KEY

const colorPickerRef = ref(null)

const config = ref({
  [SWITCH]: {
    useValue: '0',
    useStatus: 'off',
  },
  [BRIGHTNESS]: {
    useValue: 0,
    useStatus: BRIGHTNESS,
  },
  [COLOURTEMPERATURE]: {
    useValue: 1800,
    useStatus: COLOURTEMPERATURE,
  },
  color: '#fff',
})
const disabled = computed(() => isDisabled(config.value))
const deviceItem = computed(() => useGetDeviceItem(props.id))
const isOff = computed(() => config.value[SWITCH]?.useStatus == 'off')

watch(
  () => deviceItem.value,
  (val, old) => {
    if (!val) return
    const { modeStatusList = [] } = val
    if (_.isEqual(modeStatusList, old?.modeStatusList)) return
    config.value = onConfigFormat(config.value, modeStatusList)
  },
  {
    immediate: true,
  }
)

const colorTemperatureRange = computed(() => {
  if (!includesUse(props.id, COLOURTEMPERATURE)) return [0, 100]
  return stringToArray(
    deviceItem.value.columns.find((item) => item.use === COLOURTEMPERATURE).useValueRange
  )
})

// 开关
const toggle = () => {
  if (isOfflineDevice(deviceItem)) return
  const useStatus = config.value[SWITCH].useStatus == 'off' ? 'on' : 'off'
  config.value[SWITCH] = { useStatus, useValue: useStatus == 'off' ? '0' : '1' }
  triggerControl({ use: SWITCH, device: deviceItem.value, config: config.value })
}
// 色温
const onColorPickerChange = ({ color, ratio }) => {
  config.value = {
    ...config.value,
    [COLOURTEMPERATURE]: {
      useStatus: COLOURTEMPERATURE,
      useValue: ratio,
    },
    color,
  }
  if (config.value[SWITCH].useStatus == 'off') return
  triggerControl({ use: COLOURTEMPERATURE, device: deviceItem.value, config: config.value })
}
// 亮度
const onBrightnessChange = () => {
  if (config.value[SWITCH].useStatus == 'off') return
  triggerControl({ use: BRIGHTNESS, device: deviceItem.value, config: config.value })
}

const openColorPicker = () => {
  if (props.disabled || isOff.value) return
  const [min, max] = getModeRange(deviceItem.value.columns, COLOURTEMPERATURE)
  colorPickerRef.value.open({
    ratio: config.value[COLOURTEMPERATURE].useValue,
    min,
    max,
  })
}
</script>

<template>
  <div class="p-4">
    <van-cell-group style="background: transparent" :border="false">
      <van-cell class="rounded-xl" center :title="!isOff ? '已开启' : '已关闭'" :border="false">
        <template #right-icon>
          <IconFont
            :class="!isOff ? 'text-origin' : 'text-gray-400'"
            icon="switch"
            @click="toggle"
          />
        </template>
      </van-cell>
      <van-cell
        v-if="includesUse(props.id, BRIGHTNESS)"
        class="mt-4 rounded-xl"
        center
        title="亮度"
        title-style="flex:0 0 auto"
        :border="false"
        :class="disabledClass(config)"
        :label="`${config[BRIGHTNESS].useValue}%`"
      >
        <div class="h-10 p-4 pl-8">
          <van-slider
            v-model="config[BRIGHTNESS].useValue"
            :disabled="disabled"
            @change="onBrightnessChange"
          />
        </div>
      </van-cell>
      <van-cell
        v-if="includesUse(props.id, COLOURTEMPERATURE)"
        class="mt-4 rounded-xl"
        center
        title="色温"
        clickable
        :border="false"
        :class="disabledClass(config)"
        :label="`${config[COLOURTEMPERATURE].useValue}K`"
        @click="openColorPicker"
      >
        <template #right-icon>
          <span class="h-6 w-6 rounded-full" :style="{ backgroundColor: config.color }"></span>
        </template>
      </van-cell>
    </van-cell-group>
    <ColorPicker ref="colorPickerRef" :range="colorTemperatureRange" @change="onColorPickerChange">
      <template #default="{ ratio }">
        <label>{{ ratio }}K</label>
      </template>
    </ColorPicker>
  </div>
</template>
