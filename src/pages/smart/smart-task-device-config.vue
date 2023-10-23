<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import PickerSearch from '@/components/common/PickerSearch.vue'
import { useTrigger } from '@/components/trigger/useTrigger'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'
import sceneStore from '@/store/sceneStore'
import { stringToArray } from '@/utils/common'

defineOptions({ name: 'SmartTaskDeviceConfig' })

const { useGetDeviceItem, deviceUseList } = deviceStore()
const { getSceneActions, getModeColumns } = useTrigger()
const { sceneCreateItem } = storeToRefs(sceneStore())

const route = useRoute()
const router = useRouter()

const colorPickerRef = ref(null)
const showLigth = ref(false)
const useKey = ref('')
const showPricker = ref(false)

const { COLOURTEMPERATURE, BRIGHTNESS, SWITCH } = USE_KEY

const deviceColumns = ref([])
const config = ref({})
const deviceItem = computed(() => useGetDeviceItem(route.query.id), {
  onTrack(e) {
    const { columns = [], modeList = [] } = e.target
    deviceColumns.value = columns.filter((item) => item.use != SWITCH)
    config.value = Object.assign({}, ...modeList.map((item) => ({ [item.use]: item.modeValue })), {
      [SWITCH]: 'on',
    })
    console.log('config', config.value)
  },
})

const colorTemperatureRange = computed(() => {
  if (!deviceUseList(route.query.id)?.includes(COLOURTEMPERATURE)) return [0, 100]
  return stringToArray(
    deviceItem.value.columns.find((item) => item.use === COLOURTEMPERATURE).useValueRange
  )
})

const onPickerConfirm = (values) => {
  console.log(values)
}

const colorConfig = reactive({
  hue: 0,
  saturation: 100,
  luminosity: 50,
  alpha: 1,
  gradientColors: ['to top', '#FB8C1A', '#FAF6F7'],
  gradientType: 'linear',
})

const openLampConfig = (item) => {
  if (item.use === BRIGHTNESS) {
    showLigth.value = true
  } else {
    colorPickerRef.value.open()
  }
}

function onColorPickerChange({ color, ratio }) {
  config.value = { ...config.value, [COLOURTEMPERATURE]: ratio }
}

function onSwitchChange(value) {
  switch (route.query.classify) {
    case '100':
      config.value = { ...config.value, [BRIGHTNESS]: value == 'on' ? 100 : 0 }
      break

    default:
      break
  }
}

onMounted(() => {})

const onSave = () => {
  const { modeList } = deviceItem.value
  //设备控制数据
  const newModeList = modeList.map((modeItem) => {
    return { ...modeItem, modeStatus: modeItem.use, modeValue: config.value[modeItem.use] }
  })
  // const actions = getSceneActions(newModeList, route.query.id)
  // const newActions = sceneCreateItem.value.actions
  //   ? sceneCreateItem.value.actions.map((actionItem) => {
  //       const newActionItem = actions.find((item) => item.ziyuanbianhao == actionItem.ziyuanbianhao)
  //       return newActionItem ? newActionItem : actionItem
  //     })
  //   : actions
  const newDeviceItem = { ...deviceItem.value, modeList: newModeList }
  const deviceList = sceneCreateItem.value.deviceList
    ? sceneCreateItem.value.deviceList.map((item) => {
        if (item.id == route.query.id) return newDeviceItem
        return item
      })
    : [newDeviceItem]
  sceneCreateItem.value = { ...sceneCreateItem.value, deviceList }
  router.go(-4)
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="`${deviceItem?.label}设备配置`" />
    <van-radio-group v-model="config[SWITCH]" class="mt-4" @change="onSwitchChange">
      <van-cell-group inset>
        <van-cell clickable title="开" @click="config[SWITCH] = 'on'">
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
              :title="columnItem?.useName"
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
                      <van-slider v-model="config[BRIGHTNESS]" min="0">
                        <template #button>
                          <div
                            class="w-10 rounded-full bg-white py-1 text-center text-primary shadow"
                          >
                            {{ config[BRIGHTNESS] }}
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
              v-bind="colorConfig"
              :min="colorTemperatureRange[0]"
              :max="colorTemperatureRange[1]"
              @change="onColorPickerChange"
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
                  showPricker = true
                }
              "
            ></van-cell>
            <PickerSearch
              v-model:show="showPricker"
              :columns="deviceColumns.find((item) => item.use == useKey)?.list"
              :columns-field-names="{ text: 'useCn', value: 'useEn' }"
              @confirm="onPickerConfirm"
            />
          </template>
        </div>

        <van-cell clickable title="关" @click="config[SWITCH] = 'off'">
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
