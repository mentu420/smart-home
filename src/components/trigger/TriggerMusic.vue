<script setup>
import { useRect } from '@vant/use'
import { ref, computed, watch, nextTick } from 'vue'

import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import { debounce } from '@/utils/common'

import TriggerModePopover from './TriggerModePopover.vue'
import { useTrigger } from './useTrigger'

const { useGetDeviceItem, includesUse } = deviceStore()

const { getModeActions, getPlacement, isDisabled, triggerControl, onConfigFormat, getModeRange } =
  useTrigger()

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
const showVolume = ref(false)
const modeRef = ref(null)
const deviceItem = computed(() => useGetDeviceItem(props.id))
const { MODE, PLAYCONTROL, CUTSONG, VOLUME, PROCESS, LIST, SOURCE, TUNNELS } = USE_KEY
//温度、风俗、模式
const config = ref({
  [PLAYCONTROL]: {
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
    useValue: 0,
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
const disabled = computed(() => isDisabled(config.value))
const modeActions = computed(() => getModeActions(deviceItem.value, MODE))
const sourceActions = computed(() => getModeActions(deviceItem.value, SOURCE))

const placement = computed(() => getPlacement(modeRef.value))

watch(
  () => deviceItem.value,
  (val) => {
    if (!val) return
    const { modeList, columns } = val
    const [minValue, maxValue] = getModeRange(columns, VOLUME)
    min.value = minValue
    max.value = maxValue
    config.value = onConfigFormat(config.value, modeList)
  },
  { immediate: true }
)

const onStatusChange = () => {
  const useValue = config.value[PLAYCONTROL].useValue == '0' ? '1' : '0'
  config.value[PLAYCONTROL] = { useValue, useStatus: useValue == '0' ? 'pause' : 'play' }
  triggerControl(PLAYCONTROL, deviceItem.value, config.value)
}

const onVolumeChange = () => {
  triggerControl(VOLUME, deviceItem.value, config.value)
}

const onModeChange = (use) => {
  triggerControl(use, deviceItem.value, config.value)
}

const onProcessChange = () => {
  triggerControl(PROCESS, deviceItem.value, config.value)
}
</script>

<template>
  <ul class="p-4">
    <li class="mb-4 rounded-lg bg-white p-3">
      <div v-if="includesUse(props.id, PROCESS)" class="p-4 h-[56px]">
        <van-slider
          v-model="config[PROCESS].useValue"
          active-color="#333"
          @change="onProcessChange"
        />
      </div>
      <div class="flex items-center justify-between">
        <IconFont class="text-xs" icon="prev" />
        <IconFont :icon="config[PLAYCONTROL].useStatus" @click="onStatusChange" />
        <IconFont class="text-xs" icon="next" />
      </div>
    </li>
    <div ref="modeRef" class="grid gap-4 grid-cols-2">
      <li class="flex flex-1 items-center justify-between rounded-lg bg-white px-3">
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
              :min="min"
              :max="max"
              @change="onVolumeChange"
            />
          </div>
        </van-popover>
        <van-stepper
          v-model="config[VOLUME].useValue"
          class="volume-stepper"
          theme="round"
          disable-input
          :min="min"
          :max="max"
          @change="onVolumeChange"
        />
      </li>
      <template
        v-for="modeItem in [
          { title: '播放模式', use: MODE, actions: modeActions },
          { title: '音源', use: SOURCE, actions: sourceActions },
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
      <!-- <li class="flex flex-1 items-center justify-between rounded-lg bg-white">分区/列表</li> -->
    </div>
  </ul>
</template>

<style lang="scss" scoped>
.volume-stepper:deep(.van-stepper__minus) {
  border-color: #000;
  color: #000;
}
.volume-stepper:deep(.van-stepper__plus) {
  background: #000;
  color: #fff;
}
</style>
