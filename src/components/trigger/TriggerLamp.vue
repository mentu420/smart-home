<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, computed, toRefs, watch } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import deviceStore from '@/store/deviceStore'
const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

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

const deviceItem = computed(() => useGetDeviceItem(props.id))

const config = ref({ brightness: 0, hue: 90, ratio: 1800, color: '#fff' })

const hue = ref(100)
const colorPickerRef = ref(null)

// 色温
const COLORTEMPERATURE = 'colourTemperature'

const status = computed(() => (config.value.brightness == 0 ? false : true))
const colorTemperatureRange = computed(() => {
  if (!deviceUseList(props.id)?.includes(COLORTEMPERATURE)) return [0, 100]
  return deviceItem.value.columns
    .find((item) => item.use === COLORTEMPERATURE)
    .useValueRange.split(',')
    .map((item) => Number(item))
})

const colorConfig = reactive({
  hue: 0,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to top', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})

const onChange = () => {
  if (props.isUse) {
    useDeviceItemChange({ ...deviceItem.value })
  } else {
    emits('change', config.value)
  }
}

const toggle = () => {
  config.value.brightness = config.value.brightness == 0 ? 100 : 0
  onChange()
}

const onColorPickerChange = ({ color, ratio }) => {
  config.value = { ...config.value, color, ratio }
  onChange()
}

const onBrightnessChange = (value) => {
  onChange()
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
          <van-slider v-model="config.brightness" @change="onBrightnessChange" />
        </div>
      </van-cell>
      <van-cell
        v-if="deviceUseList(props.id)?.includes(COLORTEMPERATURE)"
        class="mt-4 rounded-xl"
        center
        title="色温"
        :label="`${config.ratio}K`"
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
