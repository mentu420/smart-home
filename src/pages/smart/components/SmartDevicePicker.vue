<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import pickerSearch from '@/components/common/PickerSearch.vue'
import SliderPicker from '@/components/common/SliderPicker.vue'
import { useTrigger } from '@/components/trigger/useTrigger'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'

const emits = defineEmits(['change'])

const { getModeRange } = useTrigger()

const sliderPickerRef = ref(null)
const colorPickerRef = ref(null)
const pickerSearchRef = ref(null)

function open(modeItem, deviceItem, deviceList, deviceListKey) {
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
        deviceListKey,
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
        deviceListKey,
      })
      break
    default:
      pickerSearchRef.value.open({
        modeItem,
        id: deviceItem.id,
        columns: modeItem.useColumns,
        deviceList,
        deviceListKey,
      })
      break
  }
}

function onModeChange({ selectedOptions }, { modeItem, id, deviceList, deviceListKey }) {
  const { useValue, useEn } = selectedOptions[0]

  const currentDeviceList = deviceList.length ? deviceList : deviceStore().deviceList

  const currentDeviceItem = currentDeviceList.find((item) => item.id == id)

  const newModeList = currentDeviceItem.modeList.map((item) => {
    if (item.use == modeItem.use) return { ...item, useValue, useStatus: useEn }
    return item
  })

  const newDeviceList = deviceList.length
    ? deviceList.map((item) => {
        if (item.id == id) return { ...item, modeList: newModeList }
        return item
      })
    : [{ ...currentDeviceItem, modeList: newModeList }]

  emits('change', { [deviceListKey]: newDeviceList })
}

// 进度条
function onColorPickerChange({ ratio }, scopeData) {
  onModeChange({ selectedOptions: [{ useValue: ratio, useEn: scopeData.modeItem.use }] }, scopeData)
}

function onSliderPickerChange(useValue, scopeData) {
  onModeChange({ selectedOptions: [{ useValue, useEn: scopeData.modeItem.use }] }, scopeData)
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
