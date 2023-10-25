<script setup>
import { ref, computed, watch } from 'vue'

import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import { debounce } from '@/utils/common'

import { useTrigger } from './useTrigger'

const { useGetDeviceItem, deviceUseList, useDeviceItemChange } = deviceStore()

const { getSceneActions, getModeColumns } = useTrigger()

const { STOP, PERCENT, ANGLE, SWITCH } = USE_KEY

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

const emits = defineEmits(['change', 'update:modelValue'])

const min = ref(0)
const max = ref(100)

const config = ref({
  degree: 0,
  on: false,
  off: false,
  [STOP]: true,
  [PERCENT]: 0,
  ANGLE: 0,
  SWITCH: '',
})

const deviceItem = computed(() => useGetDeviceItem(props.id), {
  onTrack(e) {
    const { columns = [] } = e.target
    if (columns.length == 0) return
    const { useValueRange = '0,100' } = columns.find((item) => item.use == 'percent') || {}
    const [minValue, maxValue] = useValueRange.split(',')
    min.value = minValue
    max.value = maxValue
    console.log(e.target)
  },
  onTrigger(e) {
    console.log('onTrigger', e)
  },
})

const onDeviceChange = debounce((use) => {
  const { modeList } = deviceItem.value
  //设备控制数据
  const newModeList = modeList.map((modeItem) => {
    return { ...modeItem, modeStatus: config.value[modeItem.use], modeValue: '1' }
  })
  if (props.isUse) {
    useDeviceItemChange({ ...deviceItem.value })
  } else {
    // 场景控制数据
    const actions = getSceneActions(newModeList, props.id)
    emits('change', actions)
  }
}, 500)

const toggle = () => {
  config.value = { ...config.value, [STOP]: true, on: false, off: false }
  onDeviceChange(STOP)
}

const onLower = () => {
  config.value = { ...config.value, [STOP]: false, on: false, off: true }
  onDeviceChange(SWITCH)
}

const onIncrease = () => {
  config.value = { ...config.value, [STOP]: false, on: true, off: false }
  onDeviceChange(SWITCH)
}

const onSliderChange = (value) => {
  config.value = { ...config.value, [PERCENT]: value }
  onDeviceChange(PERCENT)
}

const setIconClass = computed(() => (bool) => (bool ? 'text-primary' : 'text-gray-400'))
</script>

<template>
  <van-cell-group style="background: transparent" inset :border="false">
    <van-cell class="mt-4 rounded-xl" center :border="false">
      <template #icon>
        <IconFont :class="setIconClass(config.off)" icon="curtain-off" @click="onLower" />
      </template>
      <div
        class="flex items-center justify-center leading-none"
        :class="setIconClass(config[STOP])"
      >
        <IconFont icon="stop" @click="toggle" />
      </div>

      <template #right-icon>
        <IconFont :class="setIconClass(config.on)" icon="curtain-on" @click="onIncrease" />
      </template>
    </van-cell>
    <van-cell
      v-if="deviceUseList(props.id)?.includes('percent')"
      class="mt-4 rounded-xl"
      center
      title="开合度"
      :label="`${config[PERCENT]}%`"
      :border="false"
      title-style="flex:0 0 auto"
    >
      <div class="h-10 p-4 pl-8">
        <van-slider v-model="config[PERCENT]" :min="min" :max="max" @change="onSliderChange" />
      </div>
    </van-cell>
  </van-cell-group>
</template>
