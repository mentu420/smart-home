<script setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

import { setDeviceList } from '@/apis/smartApi'
import { USE_KEY } from '@/enums/deviceEnums'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import { throttle } from '@/utils/common'

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

const isControl = ref(false)
const { SWITCH, PLAY, PAUSE, PLAYCONTROL, ON } = USE_KEY
const deviceItem = computed(() => deviceList.value.find((item) => item.id == props.id))

const getDeviceStatus = computed(() => {
  if (!deviceItem.value) return 0
  const { modeList = [], classify } = deviceItem.value
  if (['100', '101', '102', '103', '104'].includes(classify)) {
    return modeList.some((modeItem) => modeItem?.use == SWITCH && modeItem?.useStatus == ON) ? 1 : 0
  } else {
    const payModeItem = modeList.find((item) => item.use == PLAYCONTROL) || { useStatus: PLAY }
    return payModeItem.useStatus == PLAY ? 1 : 0
  }
})
const onDeviceCollect = async (item) => {
  try {
    const leixing = item.collect ? 0 : 1
    await setDeviceList({
      params: { op: 5 },
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

// 控制设备
const onIconClcik = throttle(async () => {
  isControl.value = true
  const { modeList = [], id } = deviceItem.value
  const switchMode = modeList.find((item) => ['switch'].includes(item.use))
  if (switchMode) {
    const useStatus = switchMode.useStatus == 'on' ? 'off' : 'on'
    mqttDevicePublish({ id, ...switchMode, useStatus, useValue: '1' })
  } else {
    if (modeList.length == 0) return
    const playMode = modeList.find((item) => [PLAYCONTROL].includes(item.use))
    const useStatus = playMode.useStatus == PLAY ? PAUSE : PLAY
    mqttDevicePublish({ id, ...switchMode, useStatus, useValue: '1' })
  }
  await nextTick()
  setTimeout(() => (isControl.value = false), 300)
}, 500)

//打开设备配置
const openDevice = () => {
  if (props.isDrag) return
  const { id, label, classify } = deviceItem.value
  router.push({
    path: '/smart-device-status',
    query: { id, name: label, classify },
  })
}
</script>

<template>
  <div
    class="rounded-lg bg-white p-3 space-y-2 relative cursor-pointer"
    :class="{ 'transition-all duration-300 ease-out scale-90': !props.isDrag && isControl }"
  >
    <div class="flex justify-between">
      <IconFont
        v-if="!props.isDrag"
        class="text-gray-400"
        :icon="getDeviceIcon(deviceItem?.classify)"
      />
      <p v-if="props.isDrag">{{ deviceItem?.label }}</p>
      <van-icon v-if="props.isDrag" class="!text-[20px]" name="wap-nav" />
      <van-icon v-else class="!text-[20px]" name="ellipsis" @click.stop="openDevice" />
      <!-- <van-icon
        v-else
        class="!text-[20px]"
        :name="deviceItem?.collect ? 'like' : 'like-o'"
        :class="deviceItem?.collect ? 'text-red-400' : 'text-gray-300'"
        @click.stop="onDeviceCollect(deviceItem)"
      /> -->
    </div>
    <dl v-if="!props.isDrag">
      <dt>{{ deviceItem?.label }}</dt>
      <dl class="flex justify-between items-center text-gray-400">
        <label class="text-sm">{{ ['关', '开', '离线'][getDeviceStatus] }}</label>
        <IconFont icon="switch" @click.stop="onIconClcik" />
      </dl>
    </dl>
  </div>
</template>
