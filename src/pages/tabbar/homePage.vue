<script setup>
import { ref } from 'vue'

const homeList = ref([
  { text: '选项一', index: 0 },
  { text: '选项二', index: 1 },
  { text: '选项三', index: 2 },
])
const showHomeList = ref(false)
const homeAction = ref(0)

const onSelect = (action) => {
  console.log(action)
  homeAction.value = action.index
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="flex justify-between">
      <van-popover
        v-model:show="showHomeList"
        :actions="homeList"
        placement="bottom-start"
        @select="onSelect"
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
    <van-sticky>
      <div></div>
    </van-sticky>
  </div>
</template>
