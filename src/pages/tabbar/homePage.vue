<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'

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
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="flex justify-between">
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
        <van-tab title="标签 1">内容 1</van-tab>
        <van-tab title="标签 2">内容 2</van-tab>
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
