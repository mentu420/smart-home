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
const { SWITCH } = USE_KEY
const config = ref({ [SWITCH]: { useStatus: '', useValue: '' } })
const taskColumns = ref([])

const getSmartDevice = () => {
  const { smartType, id } = route.query
  return createSmartItem.value[smartType]?.find((item) => item.id == id)
}
//当前设备
const deviceItem = computed(() => useGetDeviceItem(route.query.id))

watch(
  () => deviceItem.value,
  (val) => {
    if (!val) return
    const { modeList = [] } = val
    const alreadyDevice = getSmartDevice()
    const newModeList = modeList.map((modeItem) => {
      const alreadyModeItem = alreadyDevice?.modeList?.find((item) => item.use == modeItem.use)
      if (alreadyModeItem) {
        return { ...modeItem, ...alreadyModeItem }
      } else {
        return { ...modeItem, useStatus: '', useValue: '' }
      }
    })
    taskColumns.value = JSON.parse(JSON.stringify(newModeList.filter((item) => item.use != SWITCH)))
    const switchMode = newModeList.find((item) => item.use == SWITCH)
    if (!switchMode) return
    const { useStatus, useValue } = switchMode
    config.value[SWITCH] = { useStatus, useValue }
  },
  { immediate: true }
)

function onSwitchChange(value) {
  config.value[SWITCH] = {
    ...config.value[SWITCH],
    ...{ useStatus: value, useValue: value == 'on' ? '1' : '0' },
  }
}

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
    modeList: deviceItem.value.modeList
      .map((modeItem) => {
        if (modeItem.use == SWITCH) return { ...modeItem, ...config.value[SWITCH] }
        return { ...modeItem, ...taskColumns.value.find((item) => item.use == modeItem.use) }
      })
      .filter((item) => item.useStatus != ''),
  }
  const { smartType, eventIndex, extend } = route.query
  if (smartType == 'actions') {
    createSmartItem.value = {
      ...createSmartItem.value,
      [smartType]: mergeObjectIntoArray(
        currentDeviceItem,
        createSmartItem.value[smartType] || [],
        'id'
      ),
    }
  } else {
    const newEvent = { leixing: 2, tiaojian: currentDeviceItem }
    const orginEvents = createSmartItem.value[smartType] || []
    let mergeEvents = []
    if (extend) {
      const fujiatiaojian = orginEvents.find((item, i) => i == eventIndex)[extend] || []
      mergeEvents = mergeEventsArray(fujiatiaojian, [newEvent])
    } else {
      mergeEvents = mergeEventsArray(orginEvents, [newEvent])
    }

    createSmartItem.value = {
      ...createSmartItem.value,
      [smartType]: !extend
        ? mergeEvents
        : orginEvents.map((item, i) => {
            if (i == eventIndex) return { ...item, fujiatiaojian: mergeEvents }
            return item
          }),
    }
  }

  router.goBack((smartType == 'actions') == 1 ? -4 : -5)
}

const openModePicker = (modeItem) => {
  modePickerRef.value.open({ modeItem, id: deviceItem.value.id })
}

const onDeviceModeChange = (payload) => {
  taskColumns.value = mergeObjectIntoArray(payload, taskColumns.value, 'use')
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
            v-for="(columnItem, columnIndex) in taskColumns"
            :key="columnIndex"
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
        v-for="(columnItem, columnIndex) in taskColumns"
        :key="columnIndex"
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
      ></van-cell>
    </div>

    <SmartDevicePicker ref="modePickerRef" @change="onDeviceModeChange" />

    <div class="h-24"></div>
    <div class="fixed bottom-0 left-0 right-0 bg-white px-6 py-4">
      <van-button
        block
        round
        :disabled="
          config[SWITCH].useStatus == '' && taskColumns.every((item) => item.useStatus == '')
        "
        @click="onSave"
      >
        下一步
      </van-button>
    </div>
  </div>
</template>
