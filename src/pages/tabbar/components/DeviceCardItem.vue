<script setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

import { USE_KEY } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { throttle } from '@/utils/common'
import { onDeviceStatusChange, onDeviceStatusRefresh } from '@/components/trigger/useTrigger'

const { mqttDevicePublish } = useMqtt()

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
const { getDeviceIcon } = deviceStore()

const router = useRouter()

const controlTimeout = 500 // 设备操作间隔
const { SWITCH, PLAY, PAUSE, PLAYCONTROL, ON } = USE_KEY
const deviceItem = computed(() => deviceList.value.find((item) => item.id == props.id))

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
  const { id, label, classify } = deviceItem.value
  router.push({
    path: '/smart-device-status',
    query: { id, name: label, classify },
  })
}

const openDeviceConfig = () => {
  if (props.isDrag) return
  const { id, label, classify, rId } = deviceItem.value
  router.push({
    path: '/smart-device-info',
    query: { id, name: label, classify, rId },
  })
}
</script>

<template>
  <ul class="rounded-lg bg-white flex justify-between cursor-pointer" @click.stop="openDevice">
    <li class="space-y-2 p-3">
      <IconFont
        v-if="!props.isDrag"
        class="text-origin"
        :icon="getDeviceIcon(deviceItem?.classify)"
      />
      <p>{{ deviceItem?.label }}</p>
      <p v-if="!props.isDrag" class="text-xs text-gray-400">
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
      <div class="p-3" @click.stop="onSwitchChanage">
        <IconFont :class="{ 'text-origin': getDeviceStatus == 1 }" icon="switch" />
      </div>
    </li>
  </ul>
</template>
