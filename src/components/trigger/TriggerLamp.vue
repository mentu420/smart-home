<script setup>
import { ref, reactive, computed, watch } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import { USE_KEY } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { debounce, stringToArray } from '@/utils/common'

import { useTrigger } from './useTrigger'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

const { getSceneActions, getModeColumns } = useTrigger()

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
  [SWITCH]: '0',
  [BRIGHTNESS]: 0,
  [COLOURTEMPERATURE]: 1800,
  color: '#fff',
})
const deviceItem = computed(() => useGetDeviceItem(props.id))

watch(
  () => deviceItem.value,
  (val) => {
    const { modeList } = val
    Object.keys(config.value).forEach((key) => {
      const modeItem = modeList.find((item) => item.use == key)
      if (modeItem)
        config.value = {
          ...config.value,
          [key]: key == SWITCH ? modeItem.modeStatus : parseInt(modeItem.modeValue),
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

const onDeviceChange = debounce((value) => {
  console.log(value)

  config.value = {
    ...config.value,
    ...value,
  }
  //设备控制数据
  const { modeList } = deviceItem.value
  const newModeList = modeList.map((modeItem) => {
    return {
      ...modeItem,
      modeStatus: modeItem.use == SWITCH ? config.value[modeItem.use] : modeItem.use,
      modeValue: modeItem.use == SWITCH ? '1' : config.value[modeItem.use],
    }
  })
  console.log('newModeList', newModeList)
  useDeviceItemChange({ ...deviceItem.value, modeList: newModeList })
}, 500)

// 开关
const toggle = () => {
  const value = { [SWITCH]: config.value[SWITCH] == '1' ? '0' : '1' }
  onDeviceChange({ [BRIGHTNESS]: value[SWITCH] == 1 ? 100 : 0, ...value })
}
// 色温
const onColorPickerChange = ({ color, ratio }) => {
  onDeviceChange({ [COLOURTEMPERATURE]: ratio, color, [SWITCH]: '1' })
}
// 亮度
const onBrightnessChange = (value) => {
  onDeviceChange({ [BRIGHTNESS]: value, [SWITCH]: '1' })
}
</script>

<template>
  <div>
    <van-cell-group style="background: transparent" inset :border="false">
      <van-cell
        class="mt-4 rounded-xl"
        center
        :title="config[SWITCH] == 1 ? '已开启' : '已关闭'"
        :border="false"
      >
        <template #right-icon>
          <IconFont
            :class="config[SWITCH] == 1 ? 'text-primary' : 'text-gray-400'"
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
        :label="`${config[BRIGHTNESS]}%`"
        :border="false"
        title-style="flex:0 0 auto"
      >
        <div class="h-10 p-4 pl-8">
          <van-slider v-model="config[BRIGHTNESS]" @change="onBrightnessChange" />
        </div>
      </van-cell>
      <van-cell
        v-if="deviceUseList(props.id)?.includes(COLOURTEMPERATURE)"
        class="mt-4 rounded-xl"
        center
        title="色温"
        :label="`${config[COLOURTEMPERATURE]}K`"
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
