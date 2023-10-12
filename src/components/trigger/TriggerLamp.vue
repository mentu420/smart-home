<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, computed, toRefs, watch } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import deviceStore from '@/store/deviceStore'
import { debounce, stringToArray } from '@/utils/common'

import { useTrigger } from './useTrigger'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

// 色温
const COLORTEMPERATURE = 'colourTemperature'

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

const colorConfig = reactive({
  hue: 0,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to top', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})

const deviceItem = computed(() => useGetDeviceItem(props.id))

const config = ref({ brightness: 0, colourTemperature: 1800, color: '#fff' })

const colorPickerRef = ref(null)

const status = computed(() => (config.value.brightness == 0 ? false : true))

const colorTemperatureRange = computed(() => {
  if (!deviceUseList(props.id)?.includes(COLORTEMPERATURE)) return [0, 100]
  return stringToArray(
    deviceItem.value.columns.find((item) => item.use === COLORTEMPERATURE).useValueRange
  )
})

const onDeviceChange = debounce(() => {
  const { modeList } = deviceItem.value
  //设备控制数据
  const newModeList = modeList.map((modeItem) => {
    return { ...modeItem, modeValue: config.value[modeItem.use] }
  })
  console.log('newModeList', newModeList)
  if (props.isUse) {
    useDeviceItemChange({ ...deviceItem.value, modeList: newModeList })
  } else {
    const { getSceneActions } = useTrigger()
    // 场景控制数据
    const actions = getSceneActions(status, props.id, newModeList)

    emits('change', actions, newModeList)
  }
}, 500)

const toggle = () => {
  config.value.brightness = config.value.brightness == 0 ? 100 : 0
  onDeviceChange()
}

const onColorPickerChange = ({ color, ratio }) => {
  config.value = { ...config.value, colourTemperature: ratio, color }
  onDeviceChange()
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
        v-if="deviceUseList(props.id)?.includes('brightness')"
        class="mt-4 rounded-xl"
        center
        title="亮度"
        :label="`${config.brightness}%`"
        :border="false"
        title-style="flex:0 0 auto"
      >
        <div class="h-10 p-4 pl-8">
          <van-slider v-model="config.brightness" @change="onDeviceChange" />
        </div>
      </van-cell>
      <van-cell
        v-if="deviceUseList(props.id)?.includes(COLORTEMPERATURE)"
        class="mt-4 rounded-xl"
        center
        title="色温"
        :label="`${config.colourTemperature}K`"
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
