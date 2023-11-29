<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import PickerSearch from '@/components/common/PickerSearch.vue'
import { useTrigger } from '@/components/trigger/useTrigger'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import smartStore from '@/store/smartStore'
import { stringToArray } from '@/utils/common'

import SmartDevicePicker from './components/SmartDevicePicker.vue'

defineOptions({ name: 'SmartTaskDeviceConfig' })

const { useGetDeviceItem, includesUse } = deviceStore()
const { getModeColumns, onConfigFormat } = useTrigger()
const { createSmartItem } = storeToRefs(smartStore())

const route = useRoute()
const router = useRouter()

const modePickerRef = ref(null)
const deviceItem = computed(() => useGetDeviceItem(route.query.id))
const deviceColumns = ref([])
const { SWITCH } = USE_KEY
const config = ref({ [SWITCH]: { useStatus: 'on', useValue: '1' } })
const deviceListKey = computed(() => `${route.query.key}DeviceList`)

watch(
  () => deviceItem.value,
  (val) => {
    if (!val) return
    const { modeList = [] } = val
    deviceColumns.value = modeList?.filter((item) => item.use != SWITCH)
    config.value = {
      [SWITCH]: {
        useStatus: 'on',
        useValue: '1',
      },
    }
  },
  { immediate: true }
)

function onSwitchChange(value) {
  config.value[SWITCH] = {
    ...config.value[SWITCH],
    ...{ useStatus: value, useValue: value == 'on' ? '1' : '0' },
  }
}
// 1：存储新的设备。2：变更旧的设备模块
const onSave = () => {
  const deviceList = createSmartItem.value[deviceListKey.value] || []
  const { modeList, id } = deviceItem.value
  let newDeviceList = []
  if (deviceList.some((item) => item.id == id)) {
    newDeviceList = deviceList.map((item) => {
      if (item.id == id) {
        return { ...item, modeList }
      }
      return item
    })
  } else {
    // 新的设备
    newDeviceList = [...deviceList, deviceItem.value]
  }
  console.log('new', newDeviceList)
  // console.log('deviceList', deviceList)
  // //设备控制数据
  // const newModeList = modeList.map((modeItem) => {
  //   if (modeItem.use == SWITCH) return { ...modeItem, ...config.value[modeItem.use] }
  //   const currentModeItem = deviceList.some((item) => item.id == id)
  //     ? deviceList.find((item) => item.id == id)?.modeList.find((item) => item.use == modeItem.use)
  //     : modeItem
  //   return currentModeItem
  // })

  // const newDeviceList = deviceList.length
  //   ? deviceList.map((item) => {
  //       if (item.id == route.query.id) return { ...item, modeList: newModeList }
  //       return item
  //     })
  //   : [{ ...deviceItem, modeList: newModeList }]
  // createSmartItem.value = { ...createSmartItem.value, [deviceListKey.value]: newDeviceList }
  // router.go(-4)
}

const openModePicker = (modeItem) => {
  console.log(createSmartItem.value)
  const deviceList = createSmartItem.value[deviceListKey.value] || []
  modePickerRef.value.open(modeItem, deviceItem.value, deviceList, deviceListKey)
}

const onDeviceModeChange = (newDeviceList) => {
  createSmartItem.value = {
    ...createSmartItem.value,
    [deviceListKey.value]: newDeviceList,
  }
  console.log('createSmartItem', createSmartItem.value)
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="`${deviceItem?.label}设备配置`" />
    <van-radio-group
      v-if="route.query.classify != '105'"
      v-model="config[SWITCH].useStatus"
      class="mt-4"
      @change="onSwitchChange"
    >
      <van-cell-group inset>
        <van-cell clickable title="开" @click="config[SWITCH].useStatus = 'on'">
          <template #right-icon>
            <van-radio name="on"> </van-radio>
          </template>
        </van-cell>
        <!--设备属性-->
        <div class="pl-2">
          <van-cell
            v-for="(columnItem, columnIndex) in deviceColumns"
            :key="columnIndex"
            clickable
            :title="columnItem.label"
            is-link
            @click="openModePicker(columnItem)"
          ></van-cell>
        </div>

        <van-cell clickable title="关" @click="config[SWITCH].useStatus = 'off'">
          <template #right-icon>
            <van-radio name="off"> </van-radio>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <div v-else class="p-4 rounded-lg">
      <van-cell
        v-for="(columnItem, columnIndex) in deviceColumns"
        :key="columnIndex"
        clickable
        :title="columnItem.label"
        is-link
        @click="openModePicker(columnItem)"
      ></van-cell>
    </div>

    <SmartDevicePicker ref="modePickerRef" @change="onDeviceModeChange" />

    <div class="h-24"></div>
    <div class="fixed bottom-0 left-0 right-0 bg-white px-6 py-4">
      <van-button type="primary" block round @click="onSave"> 下一步 </van-button>
    </div>
  </div>
</template>
