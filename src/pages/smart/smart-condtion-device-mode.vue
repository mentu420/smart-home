<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import smartStore from '@/store/smartStore'
import { mergeObjectIntoArray } from '@/utils/common'

import SmartDevicePicker from './components/SmartDevicePicker.vue'

defineOptions({ name: 'SmartTaskDeviceConfig' })

const { useGetDeviceItem, includesUse } = deviceStore()
const { createSmartItem } = storeToRefs(smartStore())

const route = useRoute()
const router = useRouter()

const modePickerRef = ref(null)
const checkboxRefs = ref([])
const checkedModes = ref([])
const taskColumns = ref([])

//当前设备
const deviceItem = computed(() => useGetDeviceItem(route.query.id))

watch(
  () => deviceItem.value,
  (val) => {
    if (!val) return
    console.log(val)
    const { modeList = [] } = val
    taskColumns.value = JSON.parse(JSON.stringify(modeList))
  },
  { immediate: true }
)

const mergeEventsArray = (origin, newArr) => {
  const alreadyIds = origin
    .filter((item) => newArr.some((option) => option.id == item.id))
    .map((item) => item.id)
    .filter(Boolean)
  return [...origin.filter((item) => !alreadyIds.includes(item.id)), ...newArr]
}
// 1：存储新的设备。2：变更旧的设备模块
const onSave = () => {
  //ziyuanleixing 资源类型 1，设备；2，场景
  const currentDeviceItem = {
    ...deviceItem.value,
    ziyuanleixing: 1,
    modeList: taskColumns.value.filter((modeItem) => checkedModes.value.includes(modeItem.use)),
  }

  const { smartType, eventIndex, extend } = route.query
  const newEvent = { leixing: 2, tiaojian: currentDeviceItem }
  const orginEvents = createSmartItem.value[smartType] || []
  let mergeEvents = []
  if (extend) {
    const fujiatiaojian = orginEvents.find((item, i) => i == eventIndex)[extend] || []
    mergeEvents = mergeEventsArray(fujiatiaojian, [newEvent])
  } else {
    mergeEvents = mergeEventsArray(orginEvents, [newEvent])
  }
  console.log('mergeEvents', mergeEvents)
  createSmartItem.value = {
    ...createSmartItem.value,
    [smartType]: !extend
      ? mergeEvents
      : orginEvents.map((item, i) => {
          if (i == eventIndex) return { ...item, fujiatiaojian: mergeEvents }
          return item
        }),
  }
  router.go(-4)
}

const openModePicker = (modeItem) => {
  modePickerRef.value.open({ modeItem, id: deviceItem.value.id })
}

const onDeviceModeChange = (payload) => {
  taskColumns.value = mergeObjectIntoArray(payload, taskColumns.value, 'use')
  checkedModes.value = [payload.use]
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="deviceItem?.label" />
    <van-checkbox-group v-model="checkedModes" class="mt-4" :max="1">
      <van-cell-group inset>
        <template v-for="(columnItem, columnIndex) in taskColumns" :key="columnIndex">
          <van-cell
            clickable
            is-link
            center
            :title="columnItem.label"
            :value="
              columnItem.valueIsNum
                ? columnItem.useValue
                : deviceItem.modeNames[`${columnItem.use}-${columnItem.useStatus}`]
            "
            @click="openModePicker(columnItem)"
          >
            <template #icon>
              <van-checkbox
                :ref="(el) => (checkboxRefs[columnIndex] = el)"
                class="mr-2"
                :name="columnItem.use"
                @click.stop
              />
            </template>
          </van-cell>
        </template>
      </van-cell-group>
    </van-checkbox-group>

    <SmartDevicePicker ref="modePickerRef" @change="onDeviceModeChange" />

    <div class="h-24"></div>
    <div class="fixed bottom-0 left-0 right-0 bg-white px-6 py-4">
      <van-button :disabled="checkedModes.length == 0" type="primary" block round @click="onSave">
        下一步
      </van-button>
    </div>
  </div>
</template>
