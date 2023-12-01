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
const scopeData = ref({})

/**
 * 传入模块数据，传出新的模块数据
 * modeItem 模块数据
 * **/

function open(data) {
  scopeData.value = data
  const { modeItem, id } = data
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
        id,
        title: `${modeItem.label}`,
        modelValue: modeItem.useValue,
        min,
        max,
      })
      break
    case COLOURTEMPERATURE:
      colorPickerRef.value?.open({
        modeItem,
        id,
        ratio: modeItem.useValue,
        min,
        max,
        angle: modeItem.angle,
      })
      break
    default:
      pickerSearchRef.value.open({
        modeItem,
        id,
        columns: modeItem.useColumns,
      })
      break
  }
}

function onModeChange({ selectedOptions }, { modeItem }) {
  const { useValue, useEn, angle } = selectedOptions[0]

  //newModeItem 新的模块数据
  const newModeItem = { ...modeItem, useValue, useStatus: useEn, angle }

  emits('change', newModeItem, scopeData.value)
}

// 进度条
function onColorPickerChange({ ratio, angle }, scopeData) {
  onModeChange(
    { selectedOptions: [{ useValue: ratio, useEn: scopeData.modeItem.use, angle }] },
    scopeData
  )
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
