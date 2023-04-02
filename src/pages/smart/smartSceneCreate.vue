<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import WeekRepeat from '@/components/common/WeekRepeat.vue'
import { trimFormat } from '@/hooks/useFormValidator.js'
import sceneStore from '@/store/sceneStore'

const router = useRouter()
const route = useRoute()

const uploaderRef = ref(null)
const form = ref({})
const showGallery = ref(false)
const showExecutionTime = ref(false)
const actions = [{ name: '默认图库' }, { name: '选择相机' }]
const { sceneCreateItem, sceneGallery } = storeToRefs(sceneStore())
const weekChecked = ref([0, 1, 2, 3, 4, 5, 6])
const executionTime = ref(['12', '00'])
const eventActive = ref(0) //记录将要改变的事件

const { getRepeatTimeText } = sceneStore()

const chooseFile = () => uploaderRef.value.chooseFile()
const afterRead = () => {}

const onSelectAction = (action, index) => {
  switch (index) {
    case 0:
      router.push({ path: '/smartSceneGallery' })
      break
    default:
      chooseFile()
      break
  }
}

const goCondition = () => {
  router.push({ path: '/smartCondition' })
}

const onSelect = () => {}

const onSave = async () => {
  console.log('sceneCreateItem', sceneCreateItem.value)
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

const init = () => {
  const { updateSceneCreateItem } = sceneStore()
  updateSceneCreateItem({ img: sceneGallery.value[0].src })
}

init()

watch(
  () => route.path,
  (to, from) => {
    if (to == '/smartSceneCreate' && form.value === '/tabbar/tabbarSmart') init()
  }
)
</script>

<script>
export default {
  name: 'SmartSceneCreate',
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
      </van-cell-group>
    </van-form>
    <section class="p-4">
      <ul
        v-if="sceneCreateItem.fenlei || sceneCreateItem.events.length > 0"
        class="flex items-center justify-between p-2"
      >
        <li>触发事件</li>
        <li @click="goCondition">
          <van-icon size="24" name="add" color="#e39334" />
        </li>
      </ul>
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
                <IconPark type="more-one" />
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
              class="space-x-2 rounded bg-gray-100 px-2 py-1"
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
                <IconPark type="more-one" />
              </template>
            </van-popover>
          </p>
        </li>
      </ul>
    </section>
    <ul class="space-y-4 p-4">
      <li
        v-if="!sceneCreateItem.fenlei && sceneCreateItem.events.length == 0"
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @touchstart="() => {}"
        @click="goCondition"
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加条件</label>
      </li>
      <li
        class="van-haptics-feedback flex h-16 items-center justify-center rounded-lg bg-white"
        @touchstart="() => {}"
        @click="
          router.push({
            path: '/smartTaskList',
          })
        "
      >
        <van-icon size="24" name="add" color="#e39334" />
        <label class="ml-4">添加任务</label>
      </li>
    </ul>

    <van-uploader ref="uploaderRef" class="invisible h-0" :after-read="afterRead" />
    <div class="p-6">
      <van-button type="primary" block round @click="onSave"> 保存 </van-button>
    </div>
    <van-action-sheet
      v-model:show="showGallery"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelectAction"
    />
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
