<script setup>
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { setSceneList } from '@/apis/smartApi.js'
import SmartUploader from '@/components/common/SmartUploader.vue'
import TimePicker from '@/components/common/TimePicker.vue'
import WeekRepeat from '@/components/common/WeekRepeat.vue'
import { trimFormat } from '@/hooks/useFormValidator.js'
import sceneStore from '@/store/sceneStore'

defineOptions({ name: 'SmartSceneCreate' })

const router = useRouter()
const route = useRoute()

const uploaderRef = ref(null)
const form = ref({})
const showGallery = ref(false)
const showExecutionTime = ref(false)
const { sceneCreateItem, sceneGallery } = storeToRefs(sceneStore())
const weekChecked = ref([0, 1, 2, 3, 4, 5, 6])
const executionTime = ref(['12', '00'])
const eventActive = ref(0) //记录将要改变的事件
const fileList = ref([])
const operationRef = ref(null)
const operationDealy = ref(['00', '00']) // 每个设备的延时

const { getRepeatTimeText } = sceneStore()

const onSave = async () => {
  if (!sceneCreateItem.value.actions || sceneCreateItem.value?.actions?.length == 0) {
    showToast('请添加任务')
    return
  }
  const params = { op: 2 }
  const data = sceneCreateItem.value
  const { code } = await setSceneList({ params, data })
  console.log(code)
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
  const { updateSceneCreateItem } = sceneStore()
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
  const { updateSceneCreateItem } = sceneStore()
  const events = sceneCreateItem.value.events.filter((item, index) => index != eventIndex)
  updateSceneCreateItem({ events })
}
//删除点击事件
const delEventItem = () => {
  const { updateSceneCreateItem } = sceneStore()
  updateSceneCreateItem({ fenlei: 2 })
}

function onDeviceMoreSelect(action, index, deviceItem, modeItem) {
  console.log('onDeviceMoreSelect', action, index, deviceItem, modeItem)
  switch (index) {
    case 0:
      //TODO：控制设备
      break
    case 1:
      operationRef.value?.open({ deviceItem, modeItem })
      //延时
      break
    default:
      //删除
      break
  }
}

function selectOperationDealy({ selectedValues }, { deviceItem, modeItem }) {
  sceneCreateItem.value = {
    ...sceneCreateItem.value,
    deviceList: sceneCreateItem.value.deviceList.map((item) => {
      if (item.id == deviceItem.id) {
        return {
          ...deviceItem,
          modeList: deviceItem.modeList.map((option) => {
            if (option.use == modeItem.use) {
              return { ...modeItem, dealy: selectedValues[0] * 60 + Number(selectedValues[1]) }
            }
            return option
          }),
        }
      }
    }),
  }
}

const init = () => {
  const { updateSceneCreateItem } = sceneStore()
  updateSceneCreateItem({ img: sceneGallery.value[0].src })
}

init()

watch(
  () => route.path,
  (to, from) => {
    if (to == '/smart-scene-create' && form.value === '/tabbar/tabbar-smart') init()
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
    <HeaderNavbar title="创建场景" />
    <van-form class="m-4">
      <van-cell-group class="overflow-hidden rounded-lg">
        <van-field
          v-model="sceneCreateItem.mingcheng"
          center
          clearable
          name="mingcheng"
          label="场景名称"
          placeholder="场景名称"
          maxlength="30"
          :formatter="trimFormat"
          :rules="[{ required: true, message: '请填写场景名称' }]"
        >
        </van-field>
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
        <!-- <van-cell center is-link title="房间编号" />
        <van-cell center is-link title="有效时间" />
        <WeekRepeat v-model="weekChecked" /> -->
      </van-cell-group>
    </van-form>

    <!--事件-->
    <section class="p-4">
      <div
        v-if="!sceneCreateItem.fenlei && sceneCreateItem.events.length == 0"
        v-clickable-active
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @click="goConditionConfig"
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加条件</label>
      </div>
      <ol
        v-if="sceneCreateItem.fenlei || sceneCreateItem?.events?.length > 0"
        class="flex items-center justify-between p-2"
      >
        <li>触发事件</li>
        <li @click="goConditionConfig">
          <van-icon size="24" name="add" color="#e39334" />
        </li>
      </ol>
      <!--事件列表-->
      <ul>
        <li
          v-if="sceneCreateItem.fenlei && sceneCreateItem.fenlei == 1"
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
        <li
          v-for="(eventItem, eventIndex) in sceneCreateItem.events"
          :key="eventIndex"
          class="van-haptics-feedback mb-2 flex h-16 items-center justify-between rounded-lg bg-white p-4"
        >
          <p>
            <label class="mr-2">
              {{ sceneCreateItem.fenlei && sceneCreateItem.fenlei == 1 ? '或' : '当' }}
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
        <li v-for="deviceItem in sceneCreateItem.deviceList" :key="deviceItem.id" class="space-y-4">
          <template v-for="(modeItem, modeIndex) in deviceItem.modeList" :key="modeIndex">
            <div
              v-if="modeItem.modeValue != ''"
              class="p-4 bg-white rounded-lg flex justify-between items-center"
            >
              <p class="space-x-4">
                <label>控制</label>
                <label class="px-4 py-1 bg-gray-100 rounded-full">{{ deviceItem.label }}</label>
                <label v-clickable-active class="px-4 py-1 bg-gray-100 rounded-full">
                  {{ deviceItem.modeNames[modeItem.modeValue] }}
                  <template v-if="modeItem.use != 'switch'"> - {{ modeItem.modeValue }} </template>
                </label>
              </p>
              <van-popover
                :actions="[{ text: '试一试' }, { text: '延时执行' }, { text: '删除' }]"
                placement="left"
                @select="(action, index) => onDeviceMoreSelect(action, index, deviceItem, modeItem)"
              >
                <template #reference>
                  <IconFont v-clickable-active class="text-gray-300" icon="more-round" />
                </template>
              </van-popover>
            </div>
          </template>
        </li>
      </ul>
    </section>

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
    >
    </TimePicker>

    <div class="p-6">
      <van-button type="primary" block round @click="onSave"> 保存 </van-button>
    </div>

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
