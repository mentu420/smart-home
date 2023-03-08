<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

import image1 from '@/assets/images/home-card-bg.png'

const router = useRouter()

const homeList = ref([
  { text: '选项一', index: 0 },
  { text: '选项二', index: 1 },
  { text: '选项三', index: 2 },
])
const configList = ref([
  { text: '选项一', index: 0 },
  { text: '选项二', index: 1 },
  { text: '选项三', index: 2 },
])
const tabList = ref([
  {
    text: '全屋',
    dragList: [
      { id: 0, text: '照明', list: [{}] },
      { id: 1, text: '场景', list: [{}] },
      { id: 2, text: '常用设备', list: [{}] },
    ],
  },
  {
    text: '客厅',
    dragList: [
      { id: 0, text: '照明', list: [] },
      { id: 1, text: '场景', list: [] },
      { id: 2, text: '常用设备', list: [] },
    ],
  },
])
const showHomeList = ref(false)
const homeAction = ref(0)
const showConfig = ref(false)
const tabActive = ref(0)
const drag = ref(false) // 是否可以拖拽

const dragOptions = ref({
  animation: 200,
  group: 'description',
  disabled: true, //是否可以拖拽排序
  ghostClass: 'ghost',
})

const onHomeSelect = (action) => {
  console.log(action)
  homeAction.value = action.index
}
const onConfigSelect = (action) => {
  console.log(action)
}

const treeData = ref([{ text: 'Projects' }, { text: 'Photos' }, { text: 'Videos' }])
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <div class="flex justify-between p-4">
      <van-popover
        v-model:show="showHomeList"
        :actions="homeList"
        placement="bottom-start"
        @select="onHomeSelect"
      >
        <template #reference>
          <div class="flex items-center space-x-4">
            <h4>{{ homeList.find((homeItem, homeIndex) => homeIndex == homeAction).text }}</h4>
            <van-icon name="arrow-down" />
          </div>
        </template>
      </van-popover>
      <div class="space-x-4">
        <van-icon size="20" name="bell" />
        <van-icon size="20" name="plus" @click="router.push({ path: '/houseAddDevice' })" />
      </div>
    </div>
    <div class="min-h-10 flex items-end p-4">
      <h2>26</h2>
      <p class="ml-1 mr-6 text-sm">℃</p>
      <IconPark type="moon" size="1.5em" theme="filled" />
    </div>
    <van-tabs
      v-model:active="tabActive"
      background="#f7f7f7"
      shrink
      sticky
      line-width="0"
      animated
      swipeable
    >
      <template #nav-right>
        <div class="flex flex-auto items-center justify-end pr-2">
          <van-popover
            v-model:show="showConfig"
            :actions="configList"
            placement="bottom-end"
            @select="onConfigSelect"
          >
            <template #reference>
              <IconPark type="setting-config" theme="outline" />
            </template>
          </van-popover>
        </div>
      </template>
      <van-tab v-for="(tabItem, tabIndex) in tabList" :key="tabIndex" :title="tabItem.text">
        <transition-group>
          <draggable v-bind="dragOptions" key="dragggable" v-model="tabItem.dragList" item-key="id">
            <template #item="{ element }">
              <section class="p-4">
                <h4 class="mb-2 text-gray-600">{{ element.text }}</h4>
                <ul v-if="element.id == 0" class="grid grid-cols-2 gap-4">
                  <li
                    v-for="(lightItem, lightIndex) in 4"
                    :key="lightIndex"
                    :style="{ backgroundImage: 'url(' + image1 + ')' }"
                    class="flex items-center rounded-lg bg-gray-300 bg-cover bg-center bg-no-repeat p-3"
                  >
                    <div>
                      <h4 class="space-x-2 text-white">
                        <label>一楼</label>
                        <label>客厅</label>
                      </h4>
                      <p class="mt-2 text-sm text-gray-400">2个灯亮</p>
                    </div>
                  </li>
                </ul>
                <ul v-if="element.id == 1" class="grid grid-cols-2 gap-4">
                  <li
                    v-for="(lightItem, lightIndex) in 4"
                    :key="lightIndex"
                    :style="{ backgroundImage: 'url(' + image1 + ')' }"
                    class="flex items-center rounded-lg bg-gray-300 bg-cover bg-center bg-no-repeat p-3"
                  >
                    <div class="flex h-12 items-center">
                      <h4 class="space-x-2 text-white">
                        <label>一楼</label>
                        <label class="rounded bg-gray-200 px-2 py-1 text-xs">客厅</label>
                      </h4>
                    </div>
                  </li>
                </ul>
                <ul v-if="element.id == 2" class="grid grid-cols-2 gap-4">
                  <li
                    v-for="(lightItem, lightIndex) in 4"
                    :key="lightIndex"
                    class="flex items-center rounded-lg bg-gray-300 p-3"
                  >
                    <div class="relative h-full w-full">
                      <div class="absolute top-0 right-0">
                        <IconPark type="more" />
                      </div>
                      <IconPark size="2em" type="tips" theme="filled" fill="#ff976a" />
                      <h4 class="space-x-2 text-white">
                        <label>一楼</label>
                        <label>客厅</label>
                      </h4>
                      <p class="mt-2 text-sm text-gray-400">2个灯亮</p>
                    </div>
                  </li>
                </ul>
              </section>
            </template>
          </draggable>
        </transition-group>
      </van-tab>
    </van-tabs>
  </div>
</template>
