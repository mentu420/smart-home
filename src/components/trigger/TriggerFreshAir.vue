<script setup>
import { ref, computed, watch, nextTick } from 'vue'

import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'

import TriggerModePopover from './TriggerModePopover.vue'
import {
  triggerControl,
  disabledClass,
  isDisabled,
  getModeActions,
  onConfigFormat,
} from './useTrigger'

const { useDeviceItemChange, useGetDeviceItem } = deviceStore()

const { FAN, MODE, SWITCH } = USE_KEY

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

const showSpeed = ref(false)
const showMode = ref(false)
const modeRef = ref(null)

//温度、风俗、模式
const config = ref({
  [SWITCH]: {
    useValue: '0',
    useStatus: 'off',
  },
  [FAN]: {
    useValue: '1',
    useStatus: 'auto',
  },
  [MODE]: {
    useValue: '1',
    useStatus: 'auto',
  },
})
const deviceItem = computed(() => useGetDeviceItem(props.id))
const disabled = computed(() => isDisabled(config.value))
watch(
  () => deviceItem.value,
  (val) => {
    if (!val) return
    const { modeStatusList = [] } = val
    config.value = onConfigFormat(config.value, modeStatusList)
  },
  { immediate: true }
)

const speedActions = computed(() => getModeActions(deviceItem.value, FAN))

const modeActions = computed(() => getModeActions(deviceItem.value, MODE))

const onModeChange = (use) => {
  triggerControl({ use, device: deviceItem.value, config: config.value })
}

const toggle = () => {
  const useStatus = config.value[SWITCH].useStatus == 'off' ? 'on' : 'off'
  config.value[SWITCH] = { useStatus, useValue: useStatus == 'off' ? '0' : '1' }
  triggerControl({ use: SWITCH, device: deviceItem.value, config: config.value })
}
</script>

<template>
  <ul class="p-4">
    <li class="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
      <div>
        {{ config[SWITCH]?.useStatus != 'off' ? '已开启' : '已关闭' }}
      </div>
      <IconFont
        :class="config[SWITCH]?.useStatus != 'off' ? 'text-origin' : 'text-gray-300'"
        icon="switch"
        @click="toggle"
      />
    </li>

    <div ref="modeRef" class="flex justify-between space-x-4" :class="disabledClass(config)">
      <template
        v-for="modeItem in [
          { title: '风速', use: FAN, actions: speedActions },
          { title: '模式', use: MODE, actions: modeActions },
        ]"
        :key="modeItem.use"
      >
        <li
          v-if="modeItem.actions?.length > 0"
          class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white"
        >
          <TriggerModePopover
            v-model="config[modeItem.use].useStatus"
            :actions="modeItem.actions"
            :disabled="disabled"
            :title="modeItem.title"
            @change="onModeChange(modeItem.use)"
          />
        </li>
      </template>
    </div>
  </ul>
</template>
