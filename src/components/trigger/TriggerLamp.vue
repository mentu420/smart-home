<script setup>
import { ref, reactive, computed, watch } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import { USE_KEY } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { debounce, stringToArray } from '@/utils/common'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()
const { mqttPublish } = useMqtt()

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
const deviceItem = computed(() => useGetDeviceItem(props.id))

watch(
  () => deviceItem.value,
  (val) => {
    const { modeList } = val
    Object.keys(config.value).forEach((key) => {
      const modeItem = modeList.find((item) => item.use == key)
      if (modeItem) {
        config.value[key] = {
          useStatus: modeItem.useStatus,
          useValue: key == BRIGHTNESS ? parseInt(modeItem.useValue) : modeItem.useValue,
        }
      }
    })
  }
)

const colorTemperatureRange = computed(() => {
  if (!deviceUseList(props.id)?.includes(COLOURTEMPERATURE)) return [0, 100]
  return stringToArray(
    deviceItem.value.columns.find((item) => item.use === COLOURTEMPERATURE).useValueRange
  )
})

const onDeviceChange = (use) => {
  const { modeList } = deviceItem.value
  const newModeList = modeList.map((modeItem) => {
    const modeConfig = config.value[modeItem.use]
    return { ...modeItem, ...modeConfig }
  })
  const useMode = newModeList.find((item) => item.use == use)
  mqttPublish(useMode)
  useDeviceItemChange({ ...deviceItem.value, modeList: newModeList })
}

// 开关
const toggle = () => {
  const useValue = config.value[SWITCH].useValue == '1' ? '0' : '1'
  const swithMode = deviceItem.value.columns.filter((item) => item.use == SWITCH)
  config.value = {
    ...config.value,
    [SWITCH]: {
      useValue,
      useStatus: swithMode.find((item) => item.useValue == useValue).useEn,
    },
  }
  onDeviceChange(SWITCH)
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
  if (config.value[SWITCH].useValue == '0') return
  onDeviceChange(COLOURTEMPERATURE)
}
// 亮度
const onBrightnessChange = () => {
  if (config.value[SWITCH].useValue == '0') return
  onDeviceChange(BRIGHTNESS)
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
        v-if="deviceUseList(props.id)?.includes(BRIGHTNESS)"
        class="mt-4 rounded-xl"
        center
        title="亮度"
        :label="`${config[BRIGHTNESS].useValue}%`"
        :border="false"
        title-style="flex:0 0 auto"
      >
        <div class="h-10 p-4 pl-8">
          <van-slider v-model="config[BRIGHTNESS].useValue" @change="onBrightnessChange" />
        </div>
      </van-cell>
      <van-cell
        v-if="deviceUseList(props.id)?.includes(COLOURTEMPERATURE)"
        class="mt-4 rounded-xl"
        center
        title="色温"
        :label="`${config[COLOURTEMPERATURE].useValue}K`"
        clickable
        :border="false"
        @click="colorPickerRef.open()"
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
