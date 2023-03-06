<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'

import image1 from '@/assets/images/home-card-bg.png'

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
const roomList = ref([{ text: '全屋' }, { text: '客厅' }])
const showHomeList = ref(false)
const homeAction = ref(0)
const showConfig = ref(false)
const tabActive = ref(0)

const onHomeSelect = (action) => {
  console.log(action)
  homeAction.value = action.index
}
const onConfigSelect = (action) => {
  console.log(action)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
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
        <van-icon size="20" name="plus" />
      </div>
    </div>
    <div class="h-10"></div>
    <van-sticky>
      <van-tabs v-model:active="tabActive" background="transparent" shrink sticky line-width="0">
        <van-tab v-for="(roomItem, roomIndex) in roomList" :key="roomIndex" :title="roomItem.text">
          <section class="p-4">
            <h4 class="mb-2 text-gray-600">照明</h4>
            <ul class="grid grid-cols-2 gap-4">
              <li
                v-for="(lightItem, lightIndex) in 4"
                :key="lightIndex"
                :style="{ background: 'url(' + image1 + ')' }"
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
          </section>
          <section class="p-4">
            <h4 class="mb-2 text-gray-600">常用场景</h4>
            <ul class="grid grid-cols-2 gap-4">
              <li
                v-for="(lightItem, lightIndex) in 4"
                :key="lightIndex"
                :style="{ background: 'url(' + image1 + ')' }"
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
          </section>
          <section class="p-4">
            <h4 class="mb-2 text-gray-600">常用设备</h4>
            <ul class="grid grid-cols-2 gap-4">
              <li
                v-for="(lightItem, lightIndex) in 4"
                :key="lightIndex"
                :style="{ background: 'url(' + image1 + ')' }"
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
          </section>
        </van-tab>
        <template #nav-right>
          <div class="flex flex-auto items-center justify-end">
            <van-popover
              v-model:show="showConfig"
              :actions="configList"
              placement="bottom-end"
              @select="onConfigSelect"
            >
              <template #reference>
                <icon-park type="setting-config" theme="outline" />
              </template>
            </van-popover>
          </div>
        </template>
      </van-tabs>
    </van-sticky>
  </div>
</template>
