<script setup>
import { useRect } from '@vant/use'
import { storeToRefs } from 'pinia'
import { ref, computed, watch, nextTick } from 'vue'

import { USE_KEY } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { throttle } from '@/utils/common'

import { useTrigger } from './useTrigger'

const { useGetDeviceItem, includesUse } = deviceStore()

const { triggerControl, isDisabled, disabledClass, getPlacement } = useTrigger()

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

const max = ref(32)
const min = ref(16)
const checked = ref(false)
const showMode = ref(false)
const modeRef = ref(null)

//温度、风俗、模式
const { VALUESWITCH, MODE, TEMPERATURE, SWITCH } = USE_KEY
const config = ref({
  [SWITCH]: {
    useValue: '0',
    useStatus: 'off',
  },
  [TEMPERATURE]: {
    useValue: 26,
    useStatus: TEMPERATURE,
  },
  [VALUESWITCH]: {
    useValue: '0',
    useStatus: 'off',
  },
  [MODE]: {
    useValue: '1',
    useStatus: 'auto',
  },
})
const deviceItem = computed(() => useGetDeviceItem(props.id))
const tempCopy = ref(config.value[TEMPERATURE])
const disabled = computed(() => isDisabled(config.value))
const modeActions = computed(() => deviceItem.value?.columns.filter((item) => item.use == MODE))
const placement = computed(() => getPlacement(modeRef.value))
const currentModeItem = computed(() =>
  modeActions.value?.find((item) => item.useEn == config.value[MODE].useStatus)
)

watch(
  () => deviceItem.value,
  (val) => {
    const { modeList, columns } = val
    const { useValueRange = '16,32' } = columns.find((item) => item.use == TEMPERATURE)
    const [minValue, maxValue] = useValueRange.split(',')
    min.value = minValue
    max.value = maxValue

    Object.keys(config.value).forEach((key) => {
      const modeItem = modeList.find((item) => item.use == key)
      if (modeItem) {
        config.value[key] = {
          useStatus: modeItem.useStatus,
          useValue: key == TEMPERATURE ? parseInt(modeItem.useValue) : modeItem.useValue || '1',
        }
      }
    })
  }
)

const setTemp = () => {
  nextTick(() => {
    config.value[TEMPERATURE] = { ...config.value[TEMPERATURE], useValue: tempCopy.value.useValue }
    triggerControl(TEMPERATURE, deviceItem.value, config.value)
  })
}

const onLower = () => {
  if (disabled.value) return
  if (tempCopy.value.useValue == min.value) return
  --tempCopy.value.useValue
  setTemp()
}

const onRise = () => {
  if (disabled.value) return
  if (tempCopy.value.useValue == max.value) return
  ++tempCopy.value.useValue
  setTemp()
}

const onModelSelect = (action) => {
  if (disabled.value) return
  config.value[MODE] = { ...config.value[MODE], useStatus: action.useEn }
  showMode.value = false
  if (config.value[SWITCH].useStatus == 'off') return
  triggerControl(MODE, deviceItem.value, config.value)
}

const onValveChange = (value) => {
  if (disabled.value) return
  const useStatus = value ? 'on' : 'off'
  config.value[VALUESWITCH] = { useStatus, useValue: useStatus == 'off' ? '0' : '1' }
  triggerControl(VALUESWITCH, deviceItem.value, config.value)
}

const toggle = () => {
  const useStatus = config.value[SWITCH].useStatus == 'off' ? 'on' : 'off'
  config.value[SWITCH] = { useStatus, useValue: useStatus == 'off' ? '0' : '1' }
  triggerControl(SWITCH, deviceItem.value, config.value)
}
</script>

<template>
  <ul class="p-4">
    <li class="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
      <div>
        {{ config[SWITCH]?.useStatus != 'off' ? '已开启' : '已关闭' }}
      </div>
      <div v-if="includesUse(props.id, TEMPERATURE)" class="mr-4 flex-shrink-0 text-center">
        <p>
          <label class="text-lg">{{ config[TEMPERATURE].useValue }}</label>
          <label>℃</label>
        </p>
        <p class="text-xs text-gray-400">当前温度</p>
      </div>
      <IconFont
        v-if="includesUse(props.id, SWITCH)"
        :class="config[SWITCH]?.useStatus != 'off' ? 'text-primary' : 'text-gray-300'"
        icon="switch"
        @click="toggle"
      />
    </li>
    <li
      v-if="includesUse(props.id, TEMPERATURE)"
      class="mb-4 flex items-center justify-around rounded-lg bg-white p-3"
      :class="disabledClass(config)"
    >
      <div>
        <van-icon
          :class="{ 'text-gray-300': tempCopy.useValue == min }"
          name="minus"
          size="20"
          @click="onLower"
        />
      </div>
      <div class="mr-4 flex-shrink-0 text-center">
        <p>{{ tempCopy.useValue }}℃</p>
        <p class="text-xs text-gray-400">目标温度</p>
      </div>
      <div>
        <van-icon
          :class="{ 'text-gray-300': tempCopy.useValue == max }"
          name="plus"
          size="20"
          @click="onRise"
        />
      </div>
    </li>
    <div ref="modeRef" class="flex justify-between space-x-4" :class="disabledClass(config)">
      <li
        v-if="includesUse(props.id, VALUESWITCH)"
        class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white px-4"
      >
        <p>阀门开关</p>
        <van-switch v-model="checked" :disabled="disabled" @change="onValveChange" />
      </li>
      <li
        v-if="modeActions?.length > 0"
        class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white"
      >
        <van-popover v-model:show="showMode" :placement="placement">
          <template #reference>
            <div class="flex w-full items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">
                <p>模式</p>
                <p class="text-xs text-gray-400">{{ currentModeItem?.useCn }}</p>
              </div>
              <IconFont :icon="`${currentModeItem?.use}-${currentModeItem?.useEn}`" />
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
                <IconFont class="mr-2" :icon="`${modeItem?.use}-${modeItem?.useEn}`" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-popover>
      </li>
    </div>
  </ul>
</template>

<style lang="scss" scoped>
:deep(.van-popover__wrapper) {
  display: block;
  width: 100%;
}
</style>
