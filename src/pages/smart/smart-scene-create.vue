<script setup>
import { storeToRefs } from 'pinia'
import { showConfirmDialog, showToast } from 'vant'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { getRoomList } from '@/apis/houseApi'
import { setSceneList, setSmartList } from '@/apis/smartApi.js'
import ColorPicker from '@/components/anime/RadialColorPicker.vue'
import pickerSearch from '@/components/common/PickerSearch.vue'
import SliderPicker from '@/components/common/SliderPicker.vue'
import SmartUploader from '@/components/common/SmartUploader.vue'
import TimePicker from '@/components/common/TimePicker.vue'
import WeekRepeat from '@/components/common/WeekRepeat.vue'
import { useTrigger } from '@/components/trigger/useTrigger'
import { USE_KEY } from '@/enums/deviceEnums'
import { trimFormat } from '@/hooks/useFormValidator.js'
import useMqtt from '@/hooks/useMqtt'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'
import { transformKeys } from '@/utils/common'

defineOptions({ name: 'SmartSceneCreate' })

const { getModeRange } = useTrigger()
const { mqttDevicePublish } = useMqtt()

const router = useRouter()
const route = useRoute()

const showGallery = ref(false)
const showExecutionTime = ref(false)
const { sceneCreateItem, sceneGallery, sceneList, smartList } = storeToRefs(smartStore())
const { roomList } = storeToRefs(houseStore())
const { deviceList } = storeToRefs(deviceStore())
const weekChecked = ref([0, 1, 2, 3, 4, 5, 6])
const executionTime = ref(['12', '00'])
const eventActive = ref(0) //记录将要改变的事件
const fileList = ref([])
const operationRef = ref(null)
const operationDealy = ref(['00', '00']) // 每个设备的延时
const formRef = ref(null)
const pickerSearchRef = ref(null)
const colorPickerRef = ref(null)
const sliderPickerRef = ref(null)
const roomPickerRef = ref(null)
const pageName = computed(() => (route.query.auto ? '自动化' : '场景'))

const { getRepeatTimeText } = smartStore()

function openRoomPicker() {
  roomPickerRef.value?.open({ columns: roomList.value })
}
function onSelectRoomItem({ selectedValues }) {
  sceneCreateItem.value = { ...sceneCreateItem.value, fangjianbianhao: selectedValues[0] }
}

// 打开执行时间
const openExecutionTime = (eventItem, eventIndex) => {
  const { tiaojian } = eventItem
  eventActive.value = eventIndex
  weekChecked.value = tiaojian.chongfuleixing
  showExecutionTime.value = true
  executionTime.value = tiaojian.shijian.split(':')
}
// 确认修改执行时间
const onExecutionTimeConfirm = ({ selectedValues }) => {
  const { updateSceneCreateItem } = smartStore()
  const events = sceneCreateItem.value.events.map((eventItem, eventIndex) => {
    if (eventIndex == eventActive.value)
      return {
        ...eventItem,
        tiaojian: {
          chongfuleixing: weekChecked.value,
          shijian: selectedValues.join(':'),
        },
      }
    return eventItem
  })
  updateSceneCreateItem({ events })
  showExecutionTime.value = false
}
//删除时间事件
const delTimeItem = (eventIndex) => {
  const { updateSceneCreateItem } = smartStore()
  const events = sceneCreateItem.value.events.filter((item, index) => index != eventIndex)
  updateSceneCreateItem({ events })
}
//删除点击事件
const delEventItem = () => {
  const { updateSceneCreateItem } = smartStore()
  updateSceneCreateItem({ fenlei: 2 })
}

async function onDeviceMoreSelect(action, deviceItem, modeItem) {
  if (action.id == 0) {
    mqttDevicePublish({ id: deviceItem.id, ...modeItem })
  } else if (action.id == 1) {
    operationRef.value?.open({ deviceItem, modeItem })
  } else if (action.id == 2) {
    try {
      await showConfirmDialog({ title: '提示', message: `是否删除${modeItem.label}模块` })
      const { deviceList } = sceneCreateItem.value
      const newDeviceList = deviceList.map((item) => ({
        ...item,
        modeList: item.modeList.filter((option) => option.use != modeItem.use),
      }))
      sceneCreateItem.value = { ...sceneCreateItem.value, deviceList: newDeviceList }
    } catch (error) {
      //
    }
  }
}

function openDeviceModeItem(modeItem, deviceItem) {
  const [min, max] = getModeRange(modeItem.useColumns, modeItem.use)
  const { BRIGHTNESS, COLOURTEMPERATURE, TEMPERATURE, PERCENT, ANGLE, VOLUME, PROCESS } = USE_KEY
  switch (modeItem.use) {
    case BRIGHTNESS:
    case TEMPERATURE:
    case PERCENT:
    case ANGLE:
    case VOLUME:
    case PROCESS:
      sliderPickerRef.value.open({
        modeItem,
        id: deviceItem.id,
        title: `${deviceItem.label}-${modeItem.label}`,
        modelValue: modeItem.useValue,
        min,
        max,
      })
      break
    case COLOURTEMPERATURE:
      colorPickerRef.value?.open({
        modeItem,
        id: deviceItem.id,
        ratio: modeItem.useValue,
        min,
        max,
      })
      break
    default:
      pickerSearchRef.value.open({ modeItem, id: deviceItem.id, columns: modeItem.useColumns })
      break
  }
}
// 进度条
function onColorPickerChange({ ratio }, { modeItem, id }) {
  onSelectMode({ selectedOptions: [{ useValue: ratio, useEn: modeItem.use }] }, { modeItem, id })
}

function onSliderPickerChange(useValue, { modeItem, id }) {
  onSelectMode({ selectedOptions: [{ useValue, useEn: modeItem.use }] }, { modeItem, id })
}

function onSelectMode({ selectedOptions }, { modeItem, id }) {
  const { useValue, useEn } = selectedOptions[0]
  const { deviceList } = sceneCreateItem.value
  const newDeviceList = deviceList.map((deviceItem) => {
    if (deviceItem.id == id) {
      return {
        ...deviceItem,
        modeList: deviceItem.modeList.map((item) => {
          if (item.use == modeItem.use) return { ...item, useValue, useStatus: useEn }
          return item
        }),
      }
    }
    return deviceItem
  })
  sceneCreateItem.value = {
    ...sceneCreateItem.value,
    deviceList: newDeviceList,
  }
}

function selectOperationDealy({ selectedValues }, { deviceItem, modeItem }) {
  console.log(selectedValues, deviceItem, modeItem)
  const { deviceList } = sceneCreateItem.value
  const newDeviceList = deviceList.map((item) => {
    if (item.id == deviceItem.id) {
      return {
        ...item,
        modeList: deviceItem.modeList.map((option) => {
          if (option.use == modeItem.use) {
            return {
              ...option,
              dealy: selectedValues[0] * 60 + Number(selectedValues[1]),
            }
          }
          return option
        }),
      }
    }
    return item
  })
  console.log('newDeviceList', newDeviceList)
  sceneCreateItem.value = {
    ...sceneCreateItem.value,
    deviceList: newDeviceList,
  }
}

const getSceneActions = ({ modeList, id }) => {
  const actions = modeList.map((modeItem) => {
    return {
      ziyuanleixing: 1,
      ziyuanbianhao: id,
      yanshi: modeItem.dealy,
      caozuo: {
        shuxing: modeItem.use,
        shuxingzhuangtai: modeItem.useStatus,
        shuxingzhi: modeItem.useValue,
      },
    }
  })
  return actions
}

const onSave = async () => {
  try {
    await formRef.value?.validate()
    const { deviceList = [], ...residue } = sceneCreateItem.value
    if (deviceList.length == 0) {
      showToast('请添加任务')
      return
    }
    const actions = deviceList.map((deviceItem) => getSceneActions(deviceItem)).flat()
    const op = route.query.id ? 3 : 2
    const data = { fenlei: 2, ...residue, leixing: 1, isor: 0, actions }
    const config = {
      params: { op },
      data: op == 3 ? { bianhao: route.query.id, ...data } : data,
    }
    const { useGetSceneListSync, useGetSmartListSync } = smartStore()
    if (route.query.auto) {
      await setSmartList(config)
      await useGetSmartListSync(true)
    } else {
      await setSceneList(config)
      await useGetSceneListSync(true)
    }

    router.back()
  } catch (error) {
    formRef.value?.scrollToField(error[0].name)
  }
}

async function onDelect() {
  try {
    await showConfirmDialog({
      title: '提示',
      message: `是否删除${sceneCreateItem.value.mingcheng}${pageName.value}？`,
    })
    if (route.query.auto) {
      await setSmartList({ params: { op: 4, zhinenghuabianhao: route.query.id } })
      smartList.value = smartList.value.filter((sceneItem) => sceneItem.id != route.query.id)
    } else {
      await setSceneList({ params: { op: 4, changjingbianhao: route.query.id } })
      sceneList.value = sceneList.value.filter((sceneItem) => sceneItem.id != route.query.id)
    }

    router.back()
  } catch (error) {
    //取消删除
  }
}

const init = () => {
  const { clearSceneCreateItem } = smartStore()
  clearSceneCreateItem()
  if (route.query.id) {
    const { id, rId, label, actions, ...data } = sceneList.value.find(
      (item) => item.id == route.query.id
    )
    const modeActions = actions.map(({ caozuo, ...item }) => {
      return transformKeys(
        { ...caozuo, ...item },
        {
          ziyuanbianhao: 'id',
          yanshi: 'dealy',
          shuxing: 'use',
          shuxingzhuangtai: 'useStatus',
          shuxingzhi: 'useValue',
        },
        true
      )
    })

    const sceneDeviceList = deviceList.value
      .filter((item) => modeActions.some((action) => action.id == item.id))
      .map((deviceItem) => {
        return {
          ...deviceItem,
          modeList: deviceItem.modeList.map((modeItem) => {
            const { id, ...newModeItem } =
              modeActions.find((action) => action.use == modeItem.use) || {}
            return { ...modeItem, ...newModeItem }
          }),
        }
      })

    sceneCreateItem.value = { ...sceneCreateItem.value, ...data, deviceList: sceneDeviceList }
  } else if (!route.query.auto) {
    sceneCreateItem.value = { ...sceneCreateItem.value, img: sceneGallery.value[0].src }
  }
}

onMounted(init)

watch(
  () => route.path,
  (to, from) => {
    if (to == '/smart-scene-create' && from === '/tabbar/tabbar-smart') init()
  }
)

const goConditionConfig = () => {
  router.push({ path: '/smart-condition' })
}

const openGallery = () => {
  showGallery.value = false
  router.push({ path: '/smart-scene-gallery' })
}

function goEventConfig() {
  router.push({
    path: '/smart-task-list',
  })
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="`创建${pageName}`">
      <template #right>
        <van-button type="primary" size="small" @click="onSave">保存</van-button>
      </template>
    </HeaderNavbar>
    <van-form ref="formRef" class="m-4">
      <van-cell-group class="overflow-hidden rounded-lg">
        <van-field
          v-model="sceneCreateItem.mingcheng"
          center
          clearable
          name="mingcheng"
          :label="`${pageName}名称`"
          :placeholder="`${pageName}名称`"
          maxlength="30"
          :formatter="trimFormat"
          :rules="[{ required: true, message: `请填写${pageName}名称` }]"
        >
        </van-field>
        <template v-if="!route.query.auto">
          <van-cell center is-link title="所属房间" @click="openRoomPicker">
            {{ roomList.find((roomItem) => roomItem.id == sceneCreateItem.fangjianbianhao)?.label }}
          </van-cell>
          <van-cell center is-link title="场景图片">
            <van-image
              width="8rem"
              height="4rem"
              fit="cover"
              radius="10"
              :src="sceneCreateItem.img"
              @click="showGallery = true"
            />
          </van-cell>
        </template>
        <!-- <van-cell center is-link title="有效时间" />
        <WeekRepeat v-model="weekChecked" /> -->
      </van-cell-group>
    </van-form>

    <!--事件-->
    <section class="p-4">
      <div
        v-if="sceneCreateItem?.events.length == 0 && !sceneCreateItem.fenlei"
        v-clickable-active
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @click="goConditionConfig"
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加条件</label>
      </div>
      <ol v-else class="flex items-center justify-between p-2">
        <li>触发事件</li>
        <li @click="goConditionConfig">
          <van-icon size="24" name="add" color="#e39334" />
        </li>
      </ol>
      <!--条件列表-->
      <ul>
        <li
          v-if="sceneCreateItem?.fenlei == 1"
          class="van-haptics-feedback mb-2 flex h-16 items-center justify-between rounded-lg bg-white p-4"
        >
          <p>
            <label class="mr-2">当</label>
            <label>点击此场景卡片</label>
          </p>
          <p>
            <van-popover
              :actions="[{ text: '删除' }]"
              placement="bottom-end"
              @select="delEventItem"
            >
              <template #reference>
                <IconFont class="text-xs" icon="trash" />
              </template>
            </van-popover>
          </p>
        </li>
        <template v-if="sceneCreateItem?.events.length > 0">
          <li
            v-for="(eventItem, eventIndex) in sceneCreateItem?.events"
            :key="eventIndex"
            class="van-haptics-feedback mb-2 flex h-16 items-center justify-between rounded-lg bg-white p-4"
          >
            <p>
              <label class="mr-2">
                {{ sceneCreateItem?.fenlei == 1 ? '或' : '当' }}
              </label>
              <label
                class="space-x-2 rounded-full bg-gray-100 px-4 py-1"
                @click="openExecutionTime(eventItem, eventIndex)"
              >
                <label>{{ getRepeatTimeText(eventItem.tiaojian.chongfuleixing) }}</label>
                <label>{{ eventItem.tiaojian.shijian }}</label>
              </label>
              <label class="m-2">时</label>
            </p>
            <p>
              <van-popover
                :actions="[{ text: '删除' }]"
                placement="bottom-end"
                @select="delTimeItem(eventIndex)"
              >
                <template #reference>
                  <IconFont class="text-xs" icon="trash" />
                </template>
              </van-popover>
            </p>
          </li>
        </template>
      </ul>
    </section>
    <!--任务-->
    <section class="p-4">
      <div
        v-if="!sceneCreateItem.deviceList || sceneCreateItem.deviceList?.length == 0"
        v-clickable-active
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @click="goEventConfig"
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加任务</label>
      </div>
      <ol
        v-if="sceneCreateItem.deviceList?.length > 0"
        class="flex items-center justify-between p-2"
      >
        <li>执行任务</li>
        <li @click="goEventConfig">
          <van-icon size="24" name="add" color="#e39334" />
        </li>
      </ol>
      <!--任务列表-->
      <ul>
        <li
          v-for="deviceItem in sceneCreateItem.deviceList"
          :key="deviceItem.id"
          class="mb-4 bg-white rounded-lg"
        >
          <template v-for="modeItem in deviceItem.modeList" :key="modeItem.use">
            <dl class="p-4 van-hairline--bottom flex-wrap space-y-2">
              <dt class="flex justify-between items-center">
                <p class="space-x-2">
                  <label>控制</label>
                  <label>{{ deviceItem.label }}</label>
                </p>
                <van-popover
                  :actions="[
                    { id: 0, text: '试一试' },
                    { id: 1, text: '延时执行' },
                    { id: 2, text: '删除' },
                  ]"
                  placement="left"
                  @select="(action) => onDeviceMoreSelect(action, deviceItem, modeItem)"
                >
                  <template #reference>
                    <IconFont v-clickable-active class="text-gray-300" icon="more-round" />
                  </template>
                </van-popover>
              </dt>
              <dd class="space-x-2">
                <label
                  v-clickable-active
                  class="px-4 py-1 bg-gray-100 rounded-full"
                  @click="openDeviceModeItem(modeItem, deviceItem)"
                >
                  {{
                    modeItem.valueIsNum
                      ? deviceItem.modeNames[`${modeItem.use}-${modeItem.useStatus}`]
                      : modeItem.label
                  }}
                  -
                  {{
                    modeItem.valueIsNum
                      ? modeItem.useValue
                      : deviceItem.modeNames[`${modeItem.use}-${modeItem.useStatus}`]
                  }}
                </label>
                <label
                  v-if="modeItem.dealy"
                  class="px-4 py-1 bg-gray-100 rounded-full"
                  @click="operationRef.open({ deviceItem, modeItem })"
                >
                  延时 - {{ `${Math.floor(modeItem.dealy / 60)}分${modeItem.dealy % 60}秒` }}
                </label>
              </dd>
            </dl>
          </template>
        </li>
      </ul>
    </section>

    <div v-if="route.query.id" class="p-6">
      <van-button type="primary" block round @click="onDelect"> 删除 </van-button>
    </div>

    <!--设备模块的延时-->
    <TimePicker
      ref="operationRef"
      v-model="operationDealy"
      :columns-type="['minute', 'second']"
      :formatter="
        (type, option) => {
          if (type === 'minute') {
            option.text += '分'
          }
          if (type === 'second') {
            option.text += '秒'
          }
          return option
        }
      "
      @select="selectOperationDealy"
    />

    <pickerSearch
      ref="pickerSearchRef"
      :columns-field-names="{ text: 'useCn', value: 'useEn' }"
      @select="onSelectMode"
    />

    <pickerSearch
      ref="roomPickerRef"
      :columns-field-names="{ text: 'label', value: 'id' }"
      @select="onSelectRoomItem"
    />

    <ColorPicker ref="colorPickerRef" @confirm="onColorPickerChange">
      <template #default="{ ratio }">
        <label>{{ ratio }}K</label>
      </template>
    </ColorPicker>

    <SliderPicker ref="sliderPickerRef" @confirm="onSliderPickerChange" />

    <!--场景图库-->
    <van-action-sheet v-model:show="showGallery" cancel-text="取消" close-on-click-action>
      <ul class="space-y-6 py-4 text-center">
        <li @click="openGallery">默认图库</li>
        <li>
          <SmartUploader
            v-model="fileList"
            accept="image/*"
            :max-count="1"
            @success="showGallery = false"
          >
            <template #default="slotProps">
              <p class="w-screen">选择相机{{ slotProps.loading }}</p>
            </template>
          </SmartUploader>
        </li>
      </ul>
    </van-action-sheet>
    <!--场景执行时间-->
    <van-popup v-model:show="showExecutionTime" round safe-area-inset-bottom position="bottom">
      <div class="py-4">
        <van-time-picker
          v-model="executionTime"
          title="指定时间"
          @confirm="onExecutionTimeConfirm"
        />
        <WeekRepeat v-model="weekChecked" />
      </div>
    </van-popup>
  </div>
</template>
