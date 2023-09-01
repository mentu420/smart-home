<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PickerSearch from '@/components/common/PickerSearch.vue'

const route = useRoute()
const router = useRouter()
const checked = ref(true)
const showPicker = ref(false)

const columns = [
  // 第一列
  [
    { text: '周一', value: 'Monday' },
    { text: '周二', value: 'Tuesday' },
    { text: '周三', value: 'Wednesday' },
    { text: '周四', value: 'Thursday' },
    { text: '周五', value: 'Friday' },
  ],
  // 第二列
  [
    { text: '上午', value: 'Morning' },
    { text: '下午', value: 'Afternoon' },
    { text: '晚上', value: 'Evening' },
  ],
]

const onPickerConfirm = ({ selectedValues }) => {
  console.log('selectedValues', selectedValues)
  showPicker.value = false
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="设置" />
    <section class="m-4 overflow-hidden rounded-xl">
      <van-cell-group>
        <van-cell title="设备名称" value="设备名称" is-link />
        <van-cell title="所属空间" value="房间名称" is-link @click="showPicker = !showPicker" />
        <van-cell center title="常用设备">
          <van-switch v-model="checked" />
        </van-cell>
      </van-cell-group>
    </section>
    <PickerSearch v-model:show="showPicker" :columns="columns" @confirm="onPickerConfirm" />
  </div>
</template>
