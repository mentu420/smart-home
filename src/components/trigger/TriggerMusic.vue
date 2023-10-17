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

const { MODE, PALYCONTROL } = USE_KEY

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

//温度、风俗、模式
const config = ref({ [PALYCONTROL]: 'off', [MODE]: 'list', volume: 50, cutSong: '' })

const deviceItem = computed(() => useGetDeviceItem(props.id), {
  onTrack(e) {},
  onTrigger(e) {
    console.log('onTrigger', e)
  },
})

const modeActions = computed(() => deviceItem.value?.columns.filter((item) => item.use == MODE))

const currentModeItem = computed(() =>
  modeActions.value?.find((item) => item.useEn == config.value[MODE])
)

const status = ref(false) //开关

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

const onModelSelect = (action) => {
  config.value = { ...config.value, [MODE]: action.useEn }
  showMode.value = false
  // onDeviceChange(action.useEn)
}

const onStatusChange = () => {
  status.value = !status.value
}

const onVolumeChange = (value) => {
  config.value = { ...config.value, volume: value }
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
      <IconFont icon="prev" />
      <IconFont :icon="status ? 'play' : 'stop'" @click="onStatusChange" />
      <IconFont icon="next" />
    </li>
    <div ref="modeRef" class="flex justify-between space-x-4">
      <li class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white">
        <van-popover v-model:show="showMode" :placement="placement">
          <template #reference>
            <div class="flex w-40 items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">
                <p>播放模式</p>
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
      </li>
      <li class="mb-4 flex flex-1 items-center justify-between rounded-lg bg-white">
        <van-popover v-model:show="showVolume" :placement="placement">
          <template #reference>
            <div class="flex w-40 items-center justify-between p-3">
              <div class="mr-4 flex-shrink-0">播放音量</div>
              <IconFont :icon="config.volume == 0 ? 'mute' : 'volume'" />
            </div>
          </template>
          <div class="px-[20px] py-4 h-[150px]">
            <van-slider
              v-model="config.volume"
              reverse
              vertical
              active-color="#333"
              @change="onVolumeChange"
            />
          </div>
        </van-popover>
      </li>
    </div>
  </ul>
</template>
