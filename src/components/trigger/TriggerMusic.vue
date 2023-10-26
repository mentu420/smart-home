<script setup>
import { useRect } from '@vant/use'
import { ref, computed, watch, nextTick } from 'vue'

import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import { debounce } from '@/utils/common'

import TriggerModePopover from './TriggerModePopover.vue'
import { useTrigger } from './useTrigger'

const { useGetDeviceItem, useDeviceItemChange } = deviceStore()

const { getSceneActions, getModeColumns, getPlacement } = useTrigger()

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

const showMode = ref(false)
const showVolume = ref(false)
const modeRef = ref(null)
const deviceItem = computed(() => useGetDeviceItem(props.id))

const { MODE, PALYCONTROL, CUTSONG, VOLUME, PROCESS, LIST, SOURCE, TUNNELS } = USE_KEY
//温度、风俗、模式
const config = ref({
  [PALYCONTROL]: {
    useValue: '0',
    useStatus: 'pause',
  },
  [MODE]: {
    useValue: '1',
    useStatus: 'list',
  },
  [CUTSONG]: {
    useValue: '',
    useStatus: '',
  },
  [VOLUME]: {
    useValue: 50,
    useStatus: VOLUME,
  },
  [PROCESS]: {
    useValue: 0,
    useStatus: PROCESS,
  },
  [LIST]: {
    useValue: '1',
    useStatus: LIST,
  },
  [SOURCE]: {
    useValue: '1',
    useStatus: 'local',
  },
  [TUNNELS]: {
    useValue: '1',
    useStatus: TUNNELS,
  },
})

const modeActions = computed(() => deviceItem.value?.columns.filter((item) => item.use == MODE))

const placement = computed(() => getPlacement(modeRef.value))

const onStatusChange = () => {}

const onVolumeChange = (value) => {
  config.value = { ...config.value, volume: value }
}

const onProcessChange = (value) => {}
</script>

<template>
  <ul class="p-4">
    <li class="mb-4 rounded-lg bg-white p-3">
      <div class="p-4 h-[56px]">
        <van-slider v-model="config.process" active-color="#333" @change="onProcessChange" />
      </div>
      <div class="flex items-center justify-between">
        <IconFont icon="prev" />
        <IconFont :icon="config[PALYCONTROL].useStatus" @click="onStatusChange" />
        <IconFont icon="next" />
      </div>
    </li>
    <div ref="modeRef" class="grid gap-4 grid-cols-2">
      <li class="flex flex-1 items-center justify-between rounded-lg bg-white">
        <TriggerModePopover
          v-model="config[MODE].useStatus"
          title="播放模式"
          :actions="modeActions"
        />
      </li>
      <li class="flex flex-1 items-center justify-between rounded-lg bg-white px-3">
        <van-stepper
          v-model="config[VOLUME].useValue"
          theme="round"
          button-size="22"
          disable-input
          :min="0"
          :max="100"
        />
        <van-popover v-model:show="showVolume" :placement="placement">
          <template #reference>
            <IconFont :icon="config[VOLUME].useValue == 0 ? 'mute' : 'volume'" />
          </template>
          <div class="px-[20px] py-4 h-[150px]">
            <van-slider
              v-model="config[VOLUME].useValue"
              reverse
              vertical
              active-color="#333"
              @change="onVolumeChange"
            />
          </div>
        </van-popover>
      </li>
      <li class="flex flex-1 items-center justify-between rounded-lg bg-white">
        <TriggerModePopover
          v-model="config[MODE].useStatus"
          title="播放模式"
          :actions="modeActions"
        />
      </li>
    </div>
  </ul>
</template>
