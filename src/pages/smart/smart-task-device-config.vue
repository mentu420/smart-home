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
const { sceneCreateItem } = storeToRefs(smartStore())

const route = useRoute()
const router = useRouter()

const modePickerRef = ref(null)
const deviceItem = computed(() => useGetDeviceItem(route.query.id))
const deviceColumns = ref([])
const { SWITCH } = USE_KEY
const config = ref({ [SWITCH]: { useStatus: 'on', useValue: '1' } })

console.log(useGetDeviceItem(route.query.id))

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

const onSave = () => {
  const { modeList } = deviceItem.value
  //设备控制数据
  const newModeList = modeList.map((modeItem) => {
    return { ...modeItem, ...config.value[modeItem.use] }
  })
  const { deviceList } = sceneCreateItem.value
  const newDeviceItem = { ...deviceItem.value, modeList: newModeList }
  const newDeviceList = deviceList
    ? deviceList.map((item) => {
        if (item.id == route.query.id) return { ...item, ...newDeviceItem }
        return item
      })
    : [newDeviceItem]
  sceneCreateItem.value = { ...sceneCreateItem.value, deviceList: newDeviceList }
  console.log('sceneCreateItem', sceneCreateItem.value)
  router.go(-4)
}

const openModePicker = (modeItem) => {
  const { deviceList = [] } = sceneCreateItem.value
  modePickerRef.value.open(modeItem, deviceItem.value, deviceList)
}

const onDeviceModeChange = (newDeviceList) => {
  sceneCreateItem.value = {
    ...sceneCreateItem.value,
    deviceList: newDeviceList,
  }
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
