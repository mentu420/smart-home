<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { setDeviceItem } from '@/apis/smartApi'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'

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

const router = useRouter()
const { deviceList } = storeToRefs(deviceStore())
const { getDeviceIcon } = deviceStore()

const deviceItem = computed(() => deviceList.value.find((item) => item.id == props.id))

const getDeviceStatus = computed(() => {
  if (!deviceItem.value) return 0
  const { modeList = [], classify } = deviceItem.value
  if (['100', '102', '103', '104'].includes(classify)) {
    return modeList.some((modeItem) => modeItem?.use == 'switch' && modeItem?.useStatus == 'on')
      ? 1
      : 0
  } else {
    return 0
  }
})
const onDeviceCollect = async (item) => {
  try {
    const leixing = item.collect ? 2 : 1
    await setDeviceItem({
      params: { op: 4 },
      data: {
        shebeibianhao: item.id,
        leixing,
        paixu: item.sort,
      },
    })
    const { useDeviceItemChange } = deviceStore()
    useDeviceItemChange({ ...item, collect: leixing == 1 })
  } finally {
    //
  }
}

const onIconClcik = () => {
  const { modeList, id } = deviceItem.value
  const switchMode = modeList.find((item) => ['switch'].includes(item.use))
  if (switchMode) {
    const useStatus = switchMode.useStatus == 'on' ? 'off' : 'on'
    mqttDevicePublish({ id, ...switchMode, useStatus, useValue: '1' })
  } else {
    const playMode = modeList.find((item) => ['playControl'].includes(item.use))
    const useStatus = playMode.useStatus == 'play' ? 'pause' : 'play'
    mqttDevicePublish({ id, ...switchMode, useStatus, useValue: '1' })
  }
}

const openDevice = () => {
  const { id, label, classify } = deviceItem.value
  router.push({
    path: '/smart-device-status',
    query: { id, name: label, classify },
  })
}
</script>

<template>
  <div v-clickable-active class="rounded-lg bg-white p-3 space-y-2 relative" @click="openDevice">
    <div class="flex justify-between">
      <slot name="icon">
        <IconFont
          :class="getDeviceStatus == 1 ? 'text-primary' : 'text-gray-400'"
          :icon="getDeviceIcon(deviceItem?.classify)"
          @click.stop="onIconClcik"
        />
      </slot>
      <slot name="right-icon">
        <van-icon v-if="isDrag" class="!text-[20px]" name="wap-nav" />
        <van-icon
          v-else
          class="!text-[20px]"
          :name="deviceItem?.collect ? 'like' : 'like-o'"
          :color="deviceItem?.collect ? '#e39334' : '#999'"
          @click.stop="onDeviceCollect(deviceItem)"
        />
      </slot>
    </div>
    <slot>
      <div>{{ deviceItem?.label }}</div>
    </slot>
    <div class="text-sm text-gray-400">{{ ['关', '开', '离线'][getDeviceStatus] }}</div>
  </div>
</template>
