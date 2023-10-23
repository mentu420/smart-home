<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import PickerSearch from '@/components/common/PickerSearch.vue'
import { useTrigger } from '@/components/trigger/useTrigger'
import { USE_KEY } from '@/enums/deviceEnums'
import deviceStore from '@/store/deviceStore'

defineOptions({ name: 'SmartTaskDeviceConfig' })

const { useGetDeviceItem, deviceUseList } = deviceStore()
const { getSceneActions, getModeColumns } = useTrigger()

const route = useRoute()
const router = useRouter()
const checked = ref('1')
const light = ref(0)
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
    console.log('deviceColumns', deviceColumns.value)
    config.value = Object.assign({}, ...modeList.map((item) => ({ [item.use]: item.modeValue })))
  },
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

const onChange = (use) => {
  console.log(use)

  //设备控制数据
  const { modeList } = deviceItem.value
  const newModeList = modeList.map((modeItem) => {
    return {
      ...modeItem,
      modeStatus: modeItem.use,
      modeValue: use == modeItem.use ? config.value[use] : modeItem.modeValue,
    }
  })
  const actions = getSceneActions(newModeList, route.query.id)
  console.log(actions)
  //
  showLigth.value = false
}

onMounted(() => {})

const onSave = () => {
  router.push({ path: '/smart-scene-create' })
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设备配置" />
    <van-radio-group v-model="checked" class="mt-4">
      <van-cell-group inset>
        <van-cell clickable title="开" @click="checked = '1'">
          <template #right-icon>
            <van-radio name="1"> </van-radio>
          </template>
        </van-cell>
        <!--设备属性-->
        <div class="pl-2">
          <template v-if="route.query.classify === '100'">
            <van-cell
              v-for="(columnItem, columnIndex) in deviceColumns"
              :key="columnIndex"
              clickable
              :title="columnItem?.text"
              is-link
              @click="openLampConfig(columnItem)"
            >
            </van-cell>

            <van-popup v-model:show="showLigth" round teleport="body" position="bottom">
              <ul class="py-4">
                <li>
                  <van-cell title="亮度" :boder="false">
                    <template #right-icon>
                      <van-icon name="success" size="26" @click="onChange(BRIGHTNESS)" />
                    </template>
                  </van-cell>
                  <div class="flex h-40 items-center justify-center p-8">
                    <div class="w-full">
                      <van-slider v-model="config[BRIGHTNESS]" min="1">
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
            <ColorPicker ref="colorPickerRef" v-bind="colorConfig">
              <template #default="{ ratio }">
                <p>{{ ratio }}</p>
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

        <van-cell clickable title="关" @click="checked = '2'">
          <template #right-icon>
            <van-radio name="2"> </van-radio>
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
