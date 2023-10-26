<script setup>
import { ref, reactive, computed, watch } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import { USE_KEY } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { throttle, stringToArray } from '@/utils/common'

import { useTrigger } from './useTrigger'

const { useGetDeviceItem, includesUse, useDeviceItemChange } = deviceStore()
const { triggerControl, disabledClass, isDisabled, onConfigFormat } = useTrigger()

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
const colorConfig = reactive({
  hue: 0,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to top', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})

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

watch(
  () => deviceItem.value,
  (val) => {
    const { modeList } = val
    config.value = onConfigFormat(config.value, modeList)
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
  const useStatus = config.value[SWITCH].useStatus == 'off' ? 'on' : 'off'
  config.value[SWITCH] = { useStatus, useValue: useStatus == 'off' ? '0' : '1' }
  triggerControl(SWITCH, deviceItem.value, config.value)
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
  triggerControl(COLOURTEMPERATURE, deviceItem.value, config.value)
}
// 亮度
const onBrightnessChange = () => {
  if (config.value[SWITCH].useStatus == 'off') return
  triggerControl(BRIGHTNESS, deviceItem.value, config.value)
}
</script>

<template>
  <div>
    <van-cell-group style="background: transparent" inset :border="false">
      <van-cell
        class="mt-4 rounded-xl"
        center
        :title="config[SWITCH]?.useStatus != 'off' ? '已开启' : '已关闭'"
        :border="false"
      >
        <template #right-icon>
          <IconFont
            :class="config[SWITCH]?.useStatus != 'off' ? 'text-primary' : 'text-gray-400'"
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
        @click="
          () => {
            if (!disabled) colorPickerRef.open()
          }
        "
      >
        <template #right-icon>
          <span class="h-6 w-6 rounded-full" :style="{ backgroundColor: config.color }"></span>
        </template>
      </van-cell>
    </van-cell-group>
    <ColorPicker
      ref="colorPickerRef"
      v-bind="colorConfig"
      :min="colorTemperatureRange[0]"
      :max="colorTemperatureRange[1]"
      @change="onColorPickerChange"
    >
    </ColorPicker>
  </div>
</template>
