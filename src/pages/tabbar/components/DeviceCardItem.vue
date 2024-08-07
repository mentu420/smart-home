<script setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

import { USE_KEY } from '@/enums/deviceEnums'
import socketStore from '@/store/socketStore'
import deviceStore from '@/store/deviceStore'
import { throttle } from '@/utils/common'
import { onDeviceStatusChange, onDeviceStatusRefresh } from '@/components/trigger/useTrigger'
import { TriggerFloatBubble } from '@/components/trigger/'

const props = defineProps({
  isDrag: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: '',
  },
})

const { deviceList } = storeToRefs(deviceStore())

const router = useRouter()
const triggerRef = ref(null)
const controlTimeout = 500 // 设备操作间隔
const { SWITCH, PLAY, PAUSE, PLAYCONTROL, ON } = USE_KEY
const deviceItem = computed(() => deviceList.value.find((item) => item.id == props.id))
const scope = ref('base')

// 灯(照明)、空调、地暖、新风这些大类型的设备控制卡片才能显示”快捷开关”和状态
const showStatus = computed(() => ['100', '102', '103', '104'].includes(deviceItem.value?.classify))

// 获取设备状态
const getDeviceStatus = computed(() => {
  if (!deviceItem.value) return 0
  const { modeStatusList = [], classify } = deviceItem.value
  if (['100', '101', '102', '103', '104'].includes(classify)) {
    return modeStatusList.some((modeItem) => modeItem?.use == SWITCH && modeItem?.useStatus == ON)
      ? 1
      : 0
  } else {
    const payModeItem = modeStatusList.find((item) => item.use == PLAYCONTROL) || {
      useStatus: PLAY,
    }
    return payModeItem.useStatus == PLAY ? 1 : 0
  }
})

// 设备开关触发
const onSwitchChanage = throttle(async () => {
  const { mqttDevicePublish } = socketStore()
  const { modeStatusList = [], id } = deviceItem.value
  const switchMode = modeStatusList.find((item) => [SWITCH].includes(item.use))
  if (switchMode) {
    const useStatus = switchMode.useStatus == 'on' ? 'off' : 'on'
    mqttDevicePublish({ id, ...switchMode, useStatus, useValue: '1' })
    onDeviceStatusChange({ id, use: SWITCH, useStatus, useValue: useStatus == 'on' ? '1' : '0' })
  } else {
    if (modeStatusList.length == 0) return
    const playMode = modeStatusList.find((item) => [PLAYCONTROL].includes(item.use))
    const useStatus = playMode.useStatus == PLAY ? PAUSE : PLAY
    mqttDevicePublish({ id, ...switchMode, useStatus, useValue: '1' })
    onDeviceStatusChange({ id, use: PLAYCONTROL, useStatus, useValue: '1' })
  }
  onDeviceStatusRefresh(id)
}, controlTimeout)

//打开设备
const openDevice = () => {
  if (props.isDrag) return
  if (document.documentElement.clientWidth >= 768) {
    scope.value = 'base'
    triggerRef.value?.onShow()
    return
  }
  const { id, label, classify } = deviceItem.value
  router.push({
    path: '/smart-device-status',
    query: { id, name: label, classify },
  })
}

const openDeviceConfig = () => {
  if (props.isDrag) return
  if (document.documentElement.clientWidth >= 768) {
    scope.value = 'config'
    triggerRef.value?.onShow()
    return
  }
  const { id, label, classify, rId } = deviceItem.value
  router.push({
    path: '/smart-device-info',
    query: { id, name: label, classify, rId },
  })
}
</script>

<template>
  <div class="h-full rounded-lg bg-white cursor-pointer">
    <ul v-if="!props.isDrag" class="py-3 space-y-3" @click.stop="openDevice">
      <li class="flex justify-between px-3">
        <SmartImage class="w-[28px] h-[28px]" :src="deviceItem?.iconUrl">
          <template #error>
            <IconFont class="text-origin" :icon="deviceItem.icon" />
          </template>
        </SmartImage>
        <van-icon class="!text-[20px]" name="ellipsis" @click.stop="openDeviceConfig" />
      </li>
      <li class="truncate px-3">{{ deviceItem?.label }}</li>
      <li v-if="showStatus" class="flex justify-between items-center text-gray-400">
        <p class="text-xs pl-4">
          {{ ['关', '开', '离线'][getDeviceStatus] }}
        </p>
        <div class="px-3" @click.stop="onSwitchChanage">
          <IconFont :class="{ 'text-origin': getDeviceStatus == 1 }" icon="switch" />
        </div>
      </li>
    </ul>
    <div v-else class="flex justify-between items-center px-3 py-2">
      <p class="flex-1 truncate">{{ deviceItem?.label }}</p>
      <van-icon class="!text-[20px] flex-shrink-0" name="wap-nav" />
    </div>
    <!-- <ul class="flex justify-between cursor-pointer" @click.stop="openDevice">
      <li class="space-y-2 p-3">
        <template v-if="!props.isDrag">
          <SmartImage class="w-[28px] h-[28px]" :src="deviceItem?.iconUrl">
            <template #error>
              <IconFont class="text-origin" :icon="deviceItem.icon" />
            </template>
          </SmartImage>
        </template>

        <p class="break-all">{{ deviceItem?.label }}</p>
        <p v-if="!props.isDrag && showStatus" class="text-xs text-gray-400">
          {{ ['关', '开', '离线'][getDeviceStatus] }}
        </p>
      </li>
      <li v-if="props.isDrag" class="p-3">
        <van-icon class="!text-[20px]" name="wap-nav" />
      </li>
      <li v-else class="flex flex-col justify-between text-gray-400">
        <div class="text-right p-3">
          <van-icon class="!text-[20px]" name="ellipsis" @click.stop="openDeviceConfig" />
        </div>
        <div v-if="showStatus" class="p-3" @click.stop="onSwitchChanage">
          <IconFont :class="{ 'text-origin': getDeviceStatus == 1 }" icon="switch" />
        </div>
      </li>
    </ul> -->
    <TriggerFloatBubble :id="props.id" ref="triggerRef" :title="deviceItem?.label" :scope="scope" />
  </div>
</template>
