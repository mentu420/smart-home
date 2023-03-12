<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import TimePicker from '@/components/common/TimePicker.vue'

const router = useRouter()
const columsType = ref(['hour', 'minute', 'second'])
const showTimePicker = ref(false)
const conditionTimeList = ref([])
const repeatTime = ref('')
const showRepeatAction = ref(false)
const repeatActions = ref([
  { name: '永不' },
  { name: '每天' },
  { name: '工作日' },
  { name: '周末' },
  { name: '每周' },
  { name: '每月' },
  { name: '每年' },
])

const onTimeConfirm = ({ selectedValues }) => {
  conditionTimeList.value.push(selectedValues.join(':'))
  showTimePicker.value = false
}

const delTimeItem = (i) => {
  conditionTimeList.value = conditionTimeList.value.filter((item, index) => index != i)
}

const onRepeatSelect = (value) => {
  console.log('onRepeatSelect', value)
  repeatTime.value = value.name
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="时间日期" />
    <section class="p-4">
      <van-cell class="rounded-lg" title="添加时间" is-link @click="showTimePicker = true" />
      <div class="h-4"></div>
      <van-swipe-cell
        v-for="(timeItem, timeIndex) in conditionTimeList"
        :key="timeIndex"
        class="mb-4 overflow-hidden rounded-lg"
      >
        <van-cell :border="false" :title="`时间${timeIndex + 1}`" :value="timeItem" />
        <template #right>
          <van-button square type="danger" text="删除" @click="delTimeItem(timeIndex)" />
        </template>
      </van-swipe-cell>
      <van-cell
        class="rounded-lg"
        title="日期与重复"
        is-link
        :value="repeatTime"
        @click="showRepeatAction = true"
      />
    </section>
    <TimePicker
      v-model:show="showTimePicker"
      title="添加时间"
      :columns-type="columsType"
      @confirm="onTimeConfirm"
    />
    <van-action-sheet
      v-model:show="showRepeatAction"
      :actions="repeatActions"
      cancel-text="取消"
      close-on-click-action
      @select="onRepeatSelect"
    />
  </div>
</template>
