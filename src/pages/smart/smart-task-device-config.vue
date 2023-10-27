<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import PickerSearch from '@/components/common/PickerSearch.vue'
import { useTrigger } from '@/components/trigger/useTrigger'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import sceneStore from '@/store/sceneStore'
import { stringToArray } from '@/utils/common'

defineOptions({ name: 'SmartTaskDeviceConfig' })

const { useGetDeviceItem, includesUse } = deviceStore()
const { getModeColumns, onConfigFormat } = useTrigger()
const { sceneCreateItem } = storeToRefs(sceneStore())

const route = useRoute()
const router = useRouter()

const colorPickerRef = ref(null)
const showLigth = ref(false)
const useKey = ref('')
const prickerRef = ref(false)

const deviceItem = computed(() => useGetDeviceItem(route.query.id))
const deviceColumns = ref([])
const { COLOURTEMPERATURE, BRIGHTNESS, SWITCH } = USE_KEY
const config = ref({ [SWITCH]: { useStatus: 'on', useValue: '1' } })

console.log(useGetDeviceItem(route.query.id))

watch(
  () => deviceItem.value,
  (val) => {
    if (!val) return
    const { modeList = [] } = val
    deviceColumns.value = modeList?.filter((item) => item.use != SWITCH)
    const { VOLUME, PROCESS, PERCENT, ANGLE, BRIGHTNESS, TEMPERATURE } = USE_KEY
    config.value = Object.assign(
      {},
      ...modeList.map((item) => ({
        [item.use]: {
          useStatus: item.useColumns[0].useEn,
          useValue: item.useValue,
        },
      }))
    )
  },
  { immediate: true }
)

const colorTemperatureRange = computed(() => {
  if (!includesUse(route.query.id, COLOURTEMPERATURE)) return [0, 100]
  return stringToArray(
    deviceItem.value.columns.find((item) => item.use === COLOURTEMPERATURE).useValueRange
  )
})

const onPickerConfirm = (values) => {
  console.log(values)
}

const openLampConfig = (item) => {
  if (item.use === BRIGHTNESS) {
    showLigth.value = true
  } else {
    colorPickerRef.value.open()
  }
}

const onConfigChange = (use, payload) => (config.value[use] = { ...config.value[use], ...payload })

function onColorPickerChange({ ratio }) {
  onConfigChange(COLOURTEMPERATURE, { useValue: ratio, useStatus: COLOURTEMPERATURE })
}

function onSwitchChange(value) {
  onConfigChange(SWITCH, { useStatus: value, useValue: value == 'on' ? '1' : '0' })
}

onMounted(() => {})

const onSave = () => {
  const { modeList } = deviceItem.value
  //设备控制数据
  const newModeList = modeList.map((modeItem) => {
    return { ...modeItem, ...config.value[modeItem.use] }
  })
  console.log('newModeList', newModeList)
  const newDeviceItem = { ...deviceItem.value, modeList: newModeList }
  const deviceList = sceneCreateItem.value.deviceList
    ? sceneCreateItem.value.deviceList.map((item) => {
        if (item.id == route.query.id) return newDeviceItem
        return item
      })
    : [newDeviceItem]
  sceneCreateItem.value = { ...sceneCreateItem.value, deviceList }
  console.log('sceneCreateItem', sceneCreateItem.value)
  router.go(-4)
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="`${deviceItem?.label}设备配置`" />
    <van-radio-group v-model="config[SWITCH].useStatus" class="mt-4" @change="onSwitchChange">
      <van-cell-group inset>
        <van-cell clickable title="开" @click="config[SWITCH].useStatus = 'on'">
          <template #right-icon>
            <van-radio name="on"> </van-radio>
          </template>
        </van-cell>
        <!--设备属性-->
        <div class="pl-2">
          <template v-if="route.query.classify === '100'">
            <van-cell
              v-for="(columnItem, columnIndex) in deviceColumns"
              :key="columnIndex"
              clickable
              :title="columnItem?.label"
              is-link
              @click="openLampConfig(columnItem)"
            >
            </van-cell>
            <van-popup v-model:show="showLigth" round teleport="body" position="bottom">
              <ul class="py-4">
                <li>
                  <van-cell title="亮度" :boder="false">
                    <template #right-icon>
                      <van-icon name="success" size="26" @click="showLigth = false" />
                    </template>
                  </van-cell>
                  <div class="flex h-40 items-center justify-center p-8">
                    <div class="w-full">
                      <van-slider v-model="config[BRIGHTNESS].useValue" min="0">
                        <template #button>
                          <div
                            class="w-10 rounded-full bg-white py-1 text-center text-primary shadow"
                          >
                            {{ config[BRIGHTNESS].useValue }}
                          </div>
                        </template>
                      </van-slider>
                    </div>
                  </div>
                </li>
              </ul>
            </van-popup>
            <ColorPicker
              ref="colorPickerRef"
              :range="colorTemperatureRange"
              @confirm="onColorPickerChange"
            >
              <template #default="{ ratio }">
                <label>{{ ratio }}K</label>
              </template>
            </ColorPicker>
          </template>
          <template v-else>
            <van-cell
              v-for="(columnItem, columnIndex) in deviceColumns"
              :key="columnIndex"
              clickable
              :title="columnItem.text"
              is-link
              @click="
                () => {
                  useKey = columnItem.use
                  prickerRef.open()
                }
              "
            ></van-cell>
            <PickerSearch
              :columns="deviceColumns.find((item) => item.use == useKey)?.list"
              :columns-field-names="{ text: 'useCn', value: 'useEn' }"
              @select="onPickerConfirm"
            />
          </template>
        </div>

        <van-cell clickable title="关" @click="config[SWITCH].useStatus = 'off'">
          <template #right-icon>
            <van-radio name="off"> </van-radio>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <div class="h-24"></div>
    <div class="fixed bottom-0 left-0 right-0 bg-white px-6 py-4">
      <van-button type="primary" block round @click="onSave"> 下一步 </van-button>
    </div>
  </div>
</template>
