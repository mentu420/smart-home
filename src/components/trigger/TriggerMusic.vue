<script setup>
import { UpdateRotation } from '@icon-park/vue-next/es/map'
import { useRect } from '@vant/use'
import { ref, computed, watch, nextTick } from 'vue'

import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import { debounce } from '@/utils/common'

import { useTrigger } from './useTrigger'

const { useGetDeviceItem, useDeviceItemChange } = deviceStore()

const { getSceneActions, getModeColumns } = useTrigger()

const { FAN, MODE, TEMPERATURE, PALYCONTROL } = USE_KEY

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
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

const max = ref(32)
const min = ref(16)
const showSpeed = ref(false)
const showMode = ref(false)
const modeRef = ref(null)

//温度、风俗、模式
const config = computed({
  get: () =>
    props.modelValue || { [PALYCONTROL]: 'off', [MODE]: 'list', volume: 'volume', cutSong: '' },
  set: (val) => emits('update:modelValue', val),
})

const deviceItem = computed(() => useGetDeviceItem(props.id), {
  onTrack(e) {
    const { columns = [], modeList = [] } = e.target
    if (columns.length == 0) return
    const { useValueRange = '16,32' } = columns.find((item) => item.use == TEMPERATURE) || {}
    const [minValue, maxValue] = useValueRange.split(',')
    min.value = minValue
    max.value = maxValue
  },
  onTrigger(e) {
    console.log('onTrigger', e)
  },
})

const speedActions = computed(() => deviceItem.value?.columns.filter((item) => item.use == FAN))

const modeActions = computed(() => deviceItem.value?.columns.filter((item) => item.use == MODE))

const currentModeItem = computed(() =>
  modeActions.value?.find((item) => item.useEn == config.value[MODE])
)
const currentSpeedItem = computed(() =>
  speedActions.value?.find((item) => item.useEn == config.value[FAN])
)

const tempCopy = ref(config.value[TEMPERATURE])
const status = ref(false) //空调开关

const onDeviceChange = debounce((use) => {
  const { modeList, columns } = deviceItem.value
  //设备控制数据
  const newModeList = modeList.map((modeItem) => {
    return { ...modeItem, modeValue: config.value[modeItem.use], modeStatus: use }
  })
  console.log('newModeList', newModeList)
  const useMode = newModeList.find((modeItem) => modeItem.use == use)
  if (props.isUse) {
    useDeviceItemChange({ ...deviceItem.value })
  } else {
    // 场景控制数据
    const actions = getSceneActions(status, props.id, useMode)
    emits('change', actions, actions)
  }
}, 500)

const setTemp = () =>
  nextTick(() => {
    config.value = { ...config.value, [TEMPERATURE]: tempCopy.value }
    if (!status.value) status.value = true
    onDeviceChange(TEMPERATURE)
  })

const onLower = () => {
  if (tempCopy.value == min.value) return
  --tempCopy.value
  setTemp()
}

const onRise = () => {
  if (tempCopy.value == max.value) return
  ++tempCopy.value
  setTemp()
}

const onModelSelect = (action) => {
  if (!status.value) status.value = true
  config.value = { ...config.value, [MODE]: action.useEn }
  showMode.value = false
  onDeviceChange(action.useEn)
}

const placement = computed(() => {
  if (!modeRef.value) return 'top'
  const { top } = useRect(modeRef.value)
  return top > window.innerHeight / 2 ? 'top' : 'bottom'
})
</script>

<template>
  <ul class="p-4">
    <li class="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
      <IconFont :icon="currentModeItem?.useEn" />
      <IconFont icon="prev" />
      <IconFont icon="play" />
      <IconFont icon="next" />
      <IconFont icon="next" />
    </li>
    <div ref="modeRef" class="flex justify-between space-x-4">
      <!-- <li
        v-if="speedActions?.length > 0"
        class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white"
      >
        <van-popover v-model:show="showSpeed" :placement="placement">
          <template #reference>
            <div class="flex w-40 items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">{{ currentSpeedItem?.useCn }}</div>
              <IconFont :icon="`${currentSpeedItem?.use}-${currentSpeedItem?.useEn}`" />
            </div>
          </template>
          <van-cell-group>
            <van-cell
              v-for="speedItem in speedActions"
              :key="speedItem.id"
              :title="speedItem.useCn"
              clickable
              @click="onSpeedSelect(speedItem)"
            >
              <template #icon>
                <IconFont class="mr-2" :icon="`${speedItem.use}-${speedItem.useEn}`" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-popover>
      </li> -->
      <!-- <li
        v-if="modeActions?.length > 0"
        class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white"
      >
        <van-popover v-model:show="showMode" :placement="placement">
          <template #reference>
            <div class="flex w-40 items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">
                <p>模式</p>
                <p class="text-xs text-gray-400">{{ currentModeItem?.useCn }}</p>
              </div>
              <IconFont :icon="currentModeItem?.useEn" />
            </div>
          </template>
          <van-cell-group>
            <van-cell
              v-for="modeItem in modeActions"
              :key="modeItem.id"
              :title="modeItem?.useCn"
              clickable
              @click="onModelSelect(modeItem)"
            >
              <template #icon>
                <IconFont class="mr-2" :icon="modeItem?.useEn" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-popover>
      </li> -->
    </div>
  </ul>
</template>
