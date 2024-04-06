<script setup>
import { storeToRefs } from 'pinia'
import { showConfirmDialog, showToast } from 'vant'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { setSceneList, setSmartList } from '@/apis/smartApi.js'
import pickerSearch from '@/components/common/PickerSearch.vue'
import SmartUploader from '@/components/common/SmartUploader.vue'
import TimePicker from '@/components/common/TimePicker.vue'
import { trimFormat } from '@/hooks/useFormValidator.js'
import socketStore from '@/store/socketStore'
import deviceStore from '@/store/deviceStore'
import houseStore from '@/store/houseStore'
import smartStore from '@/store/smartStore'
import { transformKeys, mergeObjectIntoArray, getWebUrlName } from '@/utils/common'
import { onScenePublishDebounce } from '@/hooks/useSmart'

import SmartCondtionList from './components/SmartCondtionList.vue'
import SmartDevicePicker from './components/SmartDevicePicker.vue'
import SmartRepeatTime from './components/SmartRepeatTime.vue'

defineOptions({ name: 'SmartSceneCreate' })

const router = useRouter()
const route = useRoute()

const showGallery = ref(false)
const taskActions = [
  { id: 0, text: '试一试' },
  { id: 1, text: '延时执行' },
  { id: 2, text: '删除' },
]

const { createSmartItem, sceneGallery, sceneList, smartList } = storeToRefs(smartStore())
const { roomList } = storeToRefs(houseStore())
const { deviceList } = storeToRefs(deviceStore())
const operationRef = ref(null)
const operationDealy = ref(['00', '00']) // 每个设备的延时
const formRef = ref(null)
const modePickerRef = ref(null)
const roomPickerRef = ref(null)
const repeatTimeRef = ref(null)
const pageName = computed(() => (route.query.fenlei == 2 ? '自动化' : '场景'))

const dealyFormat = computed(() => (dealy) => `${Math.floor(dealy / 60)}分${dealy % 60}秒`)

// 打开房间选择
function openRoomPicker() {
  const { useGetFloorTree } = houseStore()
  roomPickerRef.value?.open({ columns: useGetFloorTree() })
}
// 选择房间
function onSelectRoomItem({ selectedValues }) {
  if (!selectedValues[1]) {
    showToast('沒有房间！')
    return
  }
  createSmartItem.value = { ...createSmartItem.value, fangjianbianhao: selectedValues[1] }
}

/**
 * 修改自动化events中leixing=1的tiaojian或fujiantioajian的重复时间
 * **/
const openExecutionTime = (item, i, type) => {
  repeatTimeRef.value?.open({
    timeRepeat: {
      type: item.tiaojian.chongfuleixing,
      value: item.tiaojian.chongfuzhi,
    },
    time: item.tiaojian.shijian.split(':'),
    eventIndex: i,
    type: type,
  })
}
// 确认修改执行时间
const onExecutionTimeConfirm = ({ time, timeRepeat }, { eventIndex, type }) => {
  const { events } = createSmartItem.value
  const tiaojian = { chongfuzhi: timeRepeat.value, chongfuleixing: timeRepeat.type, shijian: time }
  const newEvents = events.map((item, i) => {
    if (type) {
      return {
        ...item,
        [type]: item[type].map((option, index) => {
          if (index == eventIndex) return { ...option, tiaojian }
          return option
        }),
      }
    } else if (i == eventIndex) {
      return { ...item, tiaojian }
    }
    return item
  })
  createSmartItem.value = { ...createSmartItem.value, events: newEvents }
}

//打开事件设备模块
const openEventDeviceMode = (modeItem, eventItem, eventIndex, type) => {
  modePickerRef.value.open({
    modeItem,
    id: eventItem.tiaojian.id,
    smartType: 'events',
    type,
    eventIndex,
  })
}

// 选择附加条件
const selectEventMoreItem = (action, eventItem, eventIndex) => {
  const { events } = createSmartItem.value
  switch (action.id) {
    case 0:
      goConditionConfig({ eventIndex, extend: 'fujiatiaojian', leixing: eventItem.leixing })
      break
    case 1:
      createSmartItem.value = {
        ...createSmartItem.value,
        events: events.map((item, i) => {
          if (i == eventIndex) {
            const { fujiatiaojian, ...data } = item
            return data
          }
          return item
        }),
      }
      break
    case 2:
      createSmartItem.value = {
        ...createSmartItem.value,
        events: events.filter((item) => item != eventItem),
      }
      break
  }
}

// 删除任务的设备的模块
const onDelectDeviceMode = (deviceItem, modeItem) => {
  const { actions } = createSmartItem.value
  const newDeviceList = actions
    .map((item) => {
      if (item.id == deviceItem.id) {
        return {
          ...item,
          modeList: item.modeList.filter((option) => option.use != modeItem.use),
        }
      }
      return item
    })
    .filter((item) => {
      if (item.ziyuanleixing == 1) return item.modeList.length > 0
      return item
    })
  createSmartItem.value = { ...createSmartItem.value, actions: newDeviceList }
}
// 删除任务中场景项
const onDelectSceneItem = async (sceneItem) => {
  createSmartItem.value = {
    ...createSmartItem.value,
    actions: createSmartItem.value.actions.filter((item) => item.id != sceneItem.id),
  }
}
// 任务设备或场景的操作项
async function onActionSelect(action, actionItem, modeItem) {
  if (action.id == 0) {
    if (modeItem) {
      socketStore().mqttDevicePublish({ id: actionItem.id, ...modeItem })
    } else {
      onScenePublishDebounce(actionItem.id)
    }
  } else if (action.id == 1) {
    operationRef.value?.open({ actionItem, modeItem })
  } else if (action.id == 2) {
    try {
      await showConfirmDialog({
        title: '提示',
        message: `是否删除 ${modeItem ? modeItem.label : actionItem.label} ${
          modeItem ? '模块' : '场景'
        }`,
      })
      if (modeItem) {
        onDelectDeviceMode(actionItem, modeItem)
      } else {
        onDelectSceneItem(actionItem)
      }
    } catch (error) {
      console.warn(error)
    }
  }
}

// 打开设备模块picker
function openDeviceModeItem(modeItem, deviceItem, smartType) {
  modePickerRef.value.open({ modeItem, id: deviceItem.id, smartType })
}
// 设备模块变更
const onDeviceModeChange = (payload, { smartType, id, type, eventIndex }) => {
  if (smartType == 'actions') {
    createSmartItem.value = {
      ...createSmartItem.value,
      [smartType]: createSmartItem.value[smartType].map((deviceItem) => {
        if (deviceItem.id == id) {
          return {
            ...deviceItem,
            modeList: mergeObjectIntoArray(payload, deviceItem.modeList, 'use'),
          }
        }

        return deviceItem
      }),
    }
  } else {
    //自动化变更设备模块
    createSmartItem.value = {
      ...createSmartItem.value,
      [smartType]: createSmartItem.value[smartType].map((item) => {
        if (item.tiaojian?.id == id) {
          return {
            ...item,
            tiaojian: {
              ...item.tiaojian,
              modeList: item.tiaojian.modeList.map((modeItem) => {
                if (modeItem.use == payload.use) return payload
                return modeItem
              }),
            },
          }
        }
        return item
      }),
    }
  }
}

function selectOperationDealy({ selectedValues }, { actionItem, modeItem }) {
  const { actions } = createSmartItem.value
  const dealy = selectedValues[0] * 60 + Number(selectedValues[1])
  const newActions = actions.map((item) => {
    if (item.id == actionItem.id) {
      if (modeItem) {
        return {
          ...item,
          modeList: actionItem.modeList.map((option) => {
            if (option.use == modeItem.use) {
              return { ...option, dealy }
            }
            return option
          }),
        }
      } else {
        return { ...item, dealy }
      }
    }
    return item
  })

  createSmartItem.value = { ...createSmartItem.value, actions: newActions }
}

// 保存是转换actions
const transformSaveActions = (actions) => {
  return actions
    .map(({ ziyuanleixing, dealy = 0, modeList, id }) => {
      if (ziyuanleixing == 1) {
        return modeList.map((modeItem) => {
          return {
            ziyuanleixing: ziyuanleixing,
            ziyuanbianhao: id,
            yanshi: modeItem?.dealy ?? 0,
            caozuo: {
              shuxing: modeItem.use,
              shuxingzhuangtai: modeItem.useStatus,
              shuxingzhi: modeItem.useValue,
            },
          }
        })
      } else {
        return {
          ziyuanleixing: ziyuanleixing,
          ziyuanbianhao: id,
          yanshi: dealy,
          caozuo: {},
        }
      }
    })
    .flat()
}

const getDeviceEvent = ({ tiaojian, isor, leixing }) => {
  return tiaojian.modeList.map((modeItem) => ({
    isor,
    leixing,
    tiaojian: {
      bianhao: tiaojian.id,
      bijiaoleixing: -1,
      shuxing: modeItem.use,
      shuxingzhuangtai: modeItem.useStatus,
      shuxingzhi: modeItem.useValue,
    },
  }))
}

//保存时转换events
const transformSaveEvents = (events = []) => {
  return events.map((eventItem) => {
    const { leixing, fujiatiaojian, tiaojian } = eventItem
    const isor = fujiatiaojian ? 1 : 0
    if (leixing == 0) {
      return eventItem
    } else if (leixing == 1) {
      const eventTime = { isor, leixing, tiaojian }
      return isor == 0
        ? eventTime
        : { ...eventTime, fujiatiaojian: transformSaveEvents(fujiatiaojian) }
    } else {
      const eventDevice = Object.assign({}, ...getDeviceEvent({ tiaojian, isor, leixing }))
      return isor == 0
        ? eventDevice
        : {
            ...eventDevice,
            fujiatiaojian: transformSaveEvents(fujiatiaojian),
          }
    }
  })
}

// 新增或者保存
const onSave = async () => {
  try {
    await formRef.value?.validate()
    const { actions = [], events, img, ...residue } = createSmartItem.value

    // 特殊的场景,不能编辑actions 源数据返回
    const isSceneKnx =
      !!route.query.id && route.query.fenlei == 1 && getSmartItem.value.leixing == 2

    if (actions.length == 0 && isSceneKnx) {
      showToast('请添加任务')
      return
    }
    const actionsResult = isSceneKnx ? getSmartItem.value.actions : transformSaveActions(actions)

    const eventsResult = transformSaveEvents(events)

    const op = route.query.id ? 3 : 2
    let data = {
      ...residue,
      leixing: 1,
      isor: 0,
      actions: actionsResult,
      img: getWebUrlName(img),
    }
    data = route.query.fenlei == 2 ? { ...data, events: eventsResult } : data
    const config = {
      params: { op },
      data: op == 3 ? { bianhao: route.query.id, ...data } : data,
    }
    const { useGetSceneListSync, useGetSmartListSync } = smartStore()

    if (route.query.fenlei == 2) {
      // 自动化
      await setSmartList(config)
      await useGetSmartListSync(true)
    } else {
      // 场景
      await setSceneList(config)
      await useGetSceneListSync(true)
    }
    router.goBack()
  } catch (error) {
    console.warn(error)
    formRef.value?.scrollToField(error[0].name)
  }
}

//收藏场景
const onColleceChange = async (value) => {
  await setSceneList({
    params: { op: 5 },
    data: { changjingbianhao: route.query.id, leixing: value ? 1 : 0 },
  })
  sceneList.value = sceneList.value.map((sceneItem) => {
    if (sceneItem.id == route.query.id) return { ...sceneItem, collect: value }
    return sceneItem
  })
}

// 删除场景
async function onDelect() {
  try {
    await showConfirmDialog({
      title: '提示',
      message: `是否删除${createSmartItem.value.mingcheng}${pageName.value}？`,
    })
    if (route.query.fenlei == 2) {
      await setSmartList({ params: { op: 4, zhinenghuabianhao: route.query.id } })
      smartList.value = smartList.value.filter((sceneItem) => sceneItem.id != route.query.id)
    } else {
      await setSceneList({ params: { op: 4, changjingbianhao: route.query.id } })
      sceneList.value = sceneList.value.filter((sceneItem) => sceneItem.id != route.query.id)
    }

    router.goBack()
  } catch (error) {
    //取消删除
  }
}

/**
 * 任务转化
 * 1：场景转化 ziyuanleixing 1
 * 2：设备转化 ziyuanleixing 2
 * **/
const getTaskConverActions = (actions) => {
  const modeActions = actions
    .filter((item) => item.ziyuanbianhao)
    .map(({ caozuo, ...item }) => {
      return transformKeys(
        { ...caozuo, ...item },
        {
          ziyuanbianhao: 'id',
          yanshi: 'dealy',
          shuxing: 'use',
          shuxingzhuangtai: 'useStatus',
          shuxingzhi: 'useValue',
          ziyuanleixing: 'ziyuanleixing',
        }
      )
    })
  const ids = [...new Set(modeActions.map((item) => item.id))]
  return ids.map((id) => {
    const actionModeList = modeActions.filter((modeItem) => modeItem.id == id)
    const ziyuanleixing = actionModeList[0]?.ziyuanleixing

    if (ziyuanleixing == 1) {
      const actionDevice = deviceList.value.find((item) => id == item.id)
      return {
        ...actionDevice,
        ziyuanleixing,
        modeList: actionDevice.modeList
          .filter((modeItem) => {
            return actionModeList.some((item) => item.use == modeItem.use)
          })
          .map((modeItem) => {
            const newModeItem = actionModeList.find((item) => item.use == modeItem.use)
            return { ...modeItem, ...newModeItem }
          }),
      }
    } else {
      const actionModeIitem = actionModeList.find((action) => action.id == id)
      console.log('actionModeIitem', actionModeIitem)
      return {
        ...sceneList.value.find((sceneItem) => sceneItem.id == id),
        ...actionModeIitem,
      }
    }
  })
}

const transformInitEvents = (events) => {
  return events.map((eventItem) => {
    const { leixing, fujiatiaojian, tiaojian } = eventItem
    const isor = fujiatiaojian ? 1 : 0
    if (leixing == 0) {
      return eventItem
    } else if (leixing == 1) {
      //时间
      return isor == 0
        ? eventItem
        : { ...eventItem, fujiatiaojian: transformInitEvents(fujiatiaojian) }
    } else {
      //设备
      const { bianhao, shuxing, shuxingzhi, shuxingzhuangtai } = tiaojian
      const deviceItem = deviceList.value.find((item) => item.id == bianhao)
      if (deviceItem) {
        const newEventItem = {
          leixing,
          tiaojian: {
            ziyuanbianhao: 1,
            ...deviceItem,
            modeList: deviceItem.modeList
              .filter((modeItem) => modeItem.use == shuxing)
              .map((modeItem) => ({
                ...modeItem,
                useValue: shuxingzhi,
                useStatus: shuxingzhuangtai,
              })),
          },
        }
        return isor == 0
          ? newEventItem
          : { ...newEventItem, fujiatiaojian: transformInitEvents(fujiatiaojian) }
      }
      return null
    }
  })
}

const getSmartItem = computed(() => {
  const list = route.query.fenlei == 2 ? smartList.value : sceneList.value
  return list?.find((item) => item?.id == route.query.id) || {}
})

// 自动化初始化
const autoInit = () => {
  if (!route.query.id) return
  const { id, rId, label, actions = [], events = [], ...data } = getSmartItem.value
  const newActions = getTaskConverActions(actions)

  createSmartItem.value = {
    ...createSmartItem.value,
    ...data,
    actions: newActions,
    events: transformInitEvents(events),
  }
}

// 场景初始化
const sceneInit = () => {
  if (route.query.id) {
    const { id, rId, label, actions = [], events = [], ...data } = getSmartItem.value
    const newActions = getTaskConverActions(actions)
    createSmartItem.value = {
      ...createSmartItem.value,
      ...data,
      actions: newActions,
    }
  } else {
    createSmartItem.value = { ...createSmartItem.value, img: sceneGallery.value[0].src }
  }
}

// 初始化场景或自动化
const init = () => {
  const { clearSceneCreateItem } = smartStore()
  clearSceneCreateItem()
  if (route.query.fenlei == 1) {
    sceneInit()
  } else {
    autoInit()
  }
  /**
   * fenlei 1：场景 2：自动化
   * 1：自动化比场景多一个events，自动化有两个智能设备actions
   * **/
  createSmartItem.value = { ...createSmartItem.value, fenlei: route.query.fenlei }
  console.log('init', createSmartItem.value)
}

onMounted(init)

watch(
  () => route.path,
  (to, from) => {
    if (to == '/smart-scene-create' && from === '/tabbar/tabbar-smart') init()
  }
)

const goConditionConfig = (params = {}) => {
  router.push({
    path: '/smart-condition',
    query: { ...route.query, ...params, smartType: 'events' },
  })
}

const openGallery = () => {
  showGallery.value = false
  router.push({ path: '/smart-scene-gallery' })
}

function goEventConfig() {
  router.push({
    path: '/smart-task-list',
    query: { smartType: 'actions', ...route.query }, //key为createSmartItem 中存储的字段
  })
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar :title="`${route.query.id ? '编辑' : '创建'}${pageName}`">
      <template #right>
        <van-button v-loading-click="onSave" type="gray" size="small">保存</van-button>
      </template>
    </HeaderNavbar>
    <van-form ref="formRef" class="m-4">
      <van-cell-group class="overflow-hidden rounded-lg">
        <van-field
          v-model.trim="createSmartItem.mingcheng"
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
        <template v-if="route.query.fenlei == 1">
          <van-cell center is-link title="所属房间" @click="openRoomPicker">
            {{ roomList.find((roomItem) => roomItem.id == createSmartItem.fangjianbianhao)?.label }}
          </van-cell>
          <van-cell v-if="route.query.id" center title="常用场景">
            <van-switch v-model="createSmartItem.collect" @change="onColleceChange" />
          </van-cell>
          <van-cell center is-link title="场景图片">
            <SmartImage
              width="8rem"
              height="4rem"
              fit="cover"
              radius="10"
              :src="createSmartItem.img"
              @click="showGallery = true"
            />
          </van-cell>
        </template>
      </van-cell-group>
    </van-form>
    <!--自动化条件-->
    <section v-if="route.query.fenlei == 2" class="p-4">
      <div
        v-if="createSmartItem?.events?.length == 0"
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @click="goConditionConfig()"
      >
        <van-icon size="24" name="add" />
        <label class="ml-4">添加条件</label>
      </div>
      <ol v-else class="flex items-center justify-between p-2">
        <li>触发事件</li>
        <li @click="goConditionConfig()">
          <van-icon size="24" name="add" />
        </li>
      </ol>
      <!--条件列表-->
      <ul v-if="createSmartItem?.events?.length">
        <li
          v-for="(eventItem, eventIndex) in createSmartItem?.events"
          :key="eventIndex"
          class="mb-3 flex min-h-16 items-center justify-between rounded-lg bg-white p-4"
        >
          <div class="break-words">
            <span class="mr-3">{{ eventIndex == 0 ? '当' : '或' }}</span>
            <span v-if="eventItem.leixing == 0">点击此{{ pageName }}卡片</span>
            <template v-else>
              <SmartCondtionList
                :item="eventItem"
                @open-time="openExecutionTime(eventItem, eventIndex)"
                @open-mode="(modeItem) => openEventDeviceMode(modeItem, eventItem, eventIndex)"
              />
              <template v-if="eventItem.fujiatiaojian">
                <span class="mx-2">且</span>
                <template
                  v-for="(extendItem, extendIndex) in eventItem.fujiatiaojian"
                  :key="extendIndex"
                >
                  <span v-if="extendIndex != 0" class="mx-2">且</span>
                  <SmartCondtionList
                    :item="extendItem"
                    @open-time="openExecutionTime(extendItem, extendIndex, 'fujiatiaojian')"
                    @open-mode="
                      (modeItem) =>
                        openEventDeviceMode(modeItem, extendItem, extendIndex, 'fujiatiaojian')
                    "
                  />
                </template>
              </template>
            </template>
          </div>
          <div class="shrink-0 ml-2">
            <van-popover
              :actions="
                eventItem.leixing == 0
                  ? [{ text: '删除', id: 2 }]
                  : [
                      { text: '附加生效条件', id: 0 },
                      { text: '清除生效条件', id: 1 },
                      { text: '删除', id: 2 },
                    ]
              "
              placement="left"
              @select="(action) => selectEventMoreItem(action, eventItem, eventIndex)"
            >
              <template #reference>
                <IconFont class="text-xs text-gray-300" icon="more-round" />
              </template>
            </van-popover>
          </div>
        </li>
      </ul>
    </section>
    <!--任务-->
    <section v-if="!(route.query.fenlei == 1 && getSmartItem.leixing == 2)" class="p-4">
      <div
        v-if="!createSmartItem.actions || createSmartItem.actions?.length == 0"
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @click="goEventConfig"
      >
        <van-icon size="24" name="add" />
        <label class="ml-4">添加任务</label>
      </div>
      <ol v-if="createSmartItem.actions?.length > 0" class="flex items-center justify-between p-2">
        <li>执行任务</li>
        <li @click="goEventConfig">
          <van-icon size="24" name="add" />
        </li>
      </ol>
      <!--任务列表-->
      <ul>
        <li
          v-for="actionItem in createSmartItem.actions"
          :key="actionItem.use"
          class="mb-4 bg-white rounded-lg overflow-hidden"
        >
          <template v-if="actionItem.ziyuanleixing == 1">
            <template v-for="modeItem in actionItem.modeList" :key="modeItem.use">
              <dl class="p-4 van-hairline--bottom flex-wrap space-y-2">
                <dt class="flex justify-between items-center">
                  <p class="space-x-2">
                    <label>控制</label>
                    <label>{{ actionItem.label }}</label>
                  </p>
                  <van-popover
                    :actions="taskActions"
                    placement="left"
                    @select="(action) => onActionSelect(action, actionItem, modeItem)"
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
                    @click="openDeviceModeItem(modeItem, actionItem, 'actions')"
                  >
                    {{ modeItem.label }}
                    -
                    {{
                      modeItem.valueIsNum
                        ? modeItem.useValue
                        : actionItem.modeNames[`${modeItem.use}-${modeItem.useStatus}`]
                    }}
                  </label>
                  <label
                    v-if="modeItem?.dealy > 0"
                    class="px-4 py-1 bg-gray-100 rounded-full"
                    @click="operationRef.open({ actionItem, modeItem })"
                  >
                    延时 - {{ dealyFormat(modeItem.dealy) }}
                  </label>
                </dd>
              </dl>
            </template>
          </template>
          <template v-else>
            <van-cell center :title="`控制 - ${actionItem.label} 场景`">
              <template #label>
                <label
                  v-if="actionItem?.dealy > 0"
                  class="my-2 px-4 py-1 bg-gray-100 rounded-full text-[14px] text-[#323233]"
                  @click.stop="operationRef.open({ actionItem })"
                >
                  延时 - {{ dealyFormat(actionItem.dealy) }}
                </label>
              </template>
              <template #right-icon>
                <van-popover
                  :actions="taskActions"
                  placement="left"
                  @select="(action) => onActionSelect(action, actionItem)"
                >
                  <template #reference>
                    <IconFont v-clickable-active class="text-gray-300" icon="more-round" />
                  </template>
                </van-popover>
              </template>
            </van-cell>
          </template>
        </li>
      </ul>
    </section>

    <div v-if="route.query.id" class="p-6">
      <van-button v-loading-click="onDelect" block round> 删除 </van-button>
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
      ref="roomPickerRef"
      :columns-field-names="{ text: 'label', value: 'id', children: 'roomList' }"
      @select="onSelectRoomItem"
    />

    <SmartDevicePicker ref="modePickerRef" @change="onDeviceModeChange" />

    <!--场景图库-->
    <van-action-sheet v-model:show="showGallery" cancel-text="取消" close-on-click-action>
      <ul class="space-y-6 py-4 text-center">
        <li @click="openGallery">默认图库</li>
        <li>
          <SmartUploader
            accept="image/*"
            :max-count="1"
            @success="
              (list) => {
                showGallery = false
                createSmartItem.img = list[0].url
              }
            "
          >
            <template #default="slotProps">
              <van-loading v-if="slotProps.loading" />
              <p v-else class="w-screen">选择相机</p>
            </template>
          </SmartUploader>
        </li>
      </ul>
    </van-action-sheet>
    <!--自动化事件中的重复时间-->
    <SmartRepeatTime ref="repeatTimeRef" @change="onExecutionTimeConfirm" />
  </div>
</template>
