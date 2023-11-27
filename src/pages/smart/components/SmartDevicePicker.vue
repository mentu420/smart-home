<script setup>
import { ref } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import pickerSearch from '@/components/common/PickerSearch.vue'
import SliderPicker from '@/components/common/SliderPicker.vue'
import { useTrigger } from '@/components/trigger/useTrigger'
import { USE_KEY } from '@/enums/deviceEnums'

const emits = defineEmits(['change'])

const { getModeRange } = useTrigger()

const sliderPickerRef = ref(null)
const colorPickerRef = ref(null)
const pickerSearchRef = ref(null)

function open(modeItem, deviceItem, deviceList) {
  const [min, max] = getModeRange(modeItem.useColumns, modeItem.use)
  const { BRIGHTNESS, COLOURTEMPERATURE, TEMPERATURE, PERCENT, ANGLE, VOLUME, PROCESS } = USE_KEY
  switch (modeItem.use) {
    case BRIGHTNESS:
    case TEMPERATURE:
    case PERCENT:
    case ANGLE:
    case VOLUME:
    case PROCESS:
      sliderPickerRef.value.open({
        modeItem,
        id: deviceItem.id,
        title: `${deviceItem.label}-${modeItem.label}`,
        modelValue: modeItem.useValue,
        min,
        max,
        deviceList,
      })
      break
    case COLOURTEMPERATURE:
      colorPickerRef.value?.open({
        modeItem,
        id: deviceItem.id,
        ratio: modeItem.useValue,
        min,
        max,
        deviceList,
      })
      break
    default:
      pickerSearchRef.value.open({
        modeItem,
        id: deviceItem.id,
        columns: modeItem.useColumns,
        deviceList,
      })
      break
  }
}

function onModeChange({ selectedOptions }, { modeItem, id, deviceList }) {
  const { useValue, useEn } = selectedOptions[0]
  const newDeviceList = deviceList.map((deviceItem) => {
    if (deviceItem.id == id) {
      return {
        ...deviceItem,
        modeList: deviceItem.modeList.map((item) => {
          if (item.use == modeItem.use) return { ...item, useValue, useStatus: useEn }
          return item
        }),
      }
    }
    return deviceItem
  })
  emits('change', newDeviceList)
}

// 进度条
function onColorPickerChange({ ratio }, { modeItem, id, deviceList }) {
  onModeChange(
    { selectedOptions: [{ useValue: ratio, useEn: modeItem.use }] },
    { modeItem, id, deviceList }
  )
}

function onSliderPickerChange(useValue, { modeItem, id, deviceList }) {
  onModeChange(
    { selectedOptions: [{ useValue, useEn: modeItem.use }] },
    { modeItem, id, deviceList }
  )
}

defineExpose({ open })
</script>

<template>
  <pickerSearch
    ref="pickerSearchRef"
    :columns-field-names="{ text: 'useCn', value: 'useEn' }"
    @select="onModeChange"
  />

  <ColorPicker ref="colorPickerRef" @confirm="onColorPickerChange">
    <template #default="{ ratio }">
      <label>{{ ratio }}K</label>
    </template>
  </ColorPicker>

  <SliderPicker ref="sliderPickerRef" @confirm="onSliderPickerChange" />
</template>
