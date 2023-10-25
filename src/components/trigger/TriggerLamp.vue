<script setup>
import { ref, reactive, computed } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import { debounce, stringToArray } from '@/utils/common'

import { useTrigger } from './useTrigger'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

const { getSceneActions, getModeColumns } = useTrigger()

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

const deviceItem = computed(() => useGetDeviceItem(props.id))
const config = ref({
  [SWITCH]: 'off',
  [BRIGHTNESS]: 0,
  [COLOURTEMPERATURE]: 1800,
  color: '#fff',
})
const status = ref(false)

const colorPickerRef = ref(null)
const colorConfig = reactive({
  hue: 0,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to top', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})
const colorTemperatureRange = computed(() => {
  if (!deviceUseList(props.id)?.includes(COLOURTEMPERATURE)) return [0, 100]
  return stringToArray(
    deviceItem.value.columns.find((item) => item.use === COLOURTEMPERATURE).useValueRange
  )
})

const onDeviceChange = debounce(() => {
  const switchMode = getModeColumns(SWITCH, deviceItem.value.modeList)
  config.value = {
    ...config.value,
    [SWITCH]: switchMode[status.value ? 1 : 0].useEn,
  }
  //设备控制数据
  const { modeList } = deviceItem.value
  const newModeList = modeList.map((modeItem) => {
    return { ...modeItem, modeStatus: config.value[modeItem.use], modeValue: '1' }
  })
  if (props.isUse) {
    useDeviceItemChange({ ...deviceItem.value, modeList: newModeList })
  } else {
    // 场景控制数据
    const actions = getSceneActions(newModeList, props.id)
    console.log(actions)
    emits('change', actions)
  }
}, 500)

// 开关
const toggle = () => {
  status.value = !status.value
  config.value = {
    ...config.value,
    [BRIGHTNESS]: config.value[BRIGHTNESS] == 0 ? 100 : 0,
  }
  onDeviceChange(SWITCH)
}
// 色温
const onColorPickerChange = ({ color, ratio }) => {
  if (!status.value) status.value = true
  config.value = { ...config.value, [COLOURTEMPERATURE]: ratio, color }
  onDeviceChange(COLOURTEMPERATURE)
}
// 亮度
const onBrightnessChange = () => {
  if (!status.value) status.value = true
  onDeviceChange(BRIGHTNESS)
}
</script>

<template>
  <div>
    <van-cell-group style="background: transparent" inset :border="false">
      <van-cell
        class="mt-4 rounded-xl"
        center
        :title="status ? '已开启' : '已关闭'"
        :border="false"
      >
        <template #right-icon>
          <IconFont
            :class="status ? 'text-primary' : 'text-gray-400'"
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
