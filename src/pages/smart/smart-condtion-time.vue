<script setup>
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import TimePicker from '@/components/common/TimePicker.vue'
import WeekRepeat from '@/components/common/WeekRepeat.vue'
import smartStore from '@/store/smartStore'

defineOptions({ name: 'SmartCondtionTime' })

const { sceneCreateItem } = storeToRefs(smartStore())

const router = useRouter()
const columsType = ref(['hour', 'minute'])
const currentTime = ref(dayjs().format('HH:ss').split(':'))
const conditionTimeList = ref([])
const timePickerRef = ref(null)

const weekChecked = ref([0, 1, 2, 3, 4, 5, 6])

const onTimeConfirm = ({ selectedValues }) => {
  conditionTimeList.value.push(selectedValues.join(':'))
  timePickerRef.value.close()
}

const delTimeItem = (i) => {
  conditionTimeList.value = conditionTimeList.value.filter((item, index) => index != i)
}

const onSave = () => {
  const { updateSceneCreateItem } = smartStore()

  const events = [
    ...sceneCreateItem.value.events,
    ...conditionTimeList.value.map((timeItem) => ({
      leixing: 1,
      tiaojian: {
        shijian: timeItem,
        chongfuleixing: weekChecked.value,
      },
    })),
  ]

  updateSceneCreateItem({ events })
  router.go(-2)
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="时间日期" />
    <section class="space-y-4 p-4">
      <van-cell class="rounded-lg" title="添加时间" is-link @click="timePickerRef.open()" />
      <van-swipe-cell
        v-for="(timeItem, timeIndex) in conditionTimeList"
        :key="timeIndex"
        class="overflow-hidden rounded-lg"
      >
        <van-cell :border="false" :title="`时间${timeIndex + 1}`" :value="timeItem" />
        <template #right>
          <van-button square type="danger" text="删除" @click="delTimeItem(timeIndex)" />
        </template>
      </van-swipe-cell>
      <WeekRepeat v-model="weekChecked" />
    </section>
    <div class="p-6">
      <van-button
        type="primary"
        block
        round
        :disabled="conditionTimeList.length == 0"
        @click="onSave"
      >
        下一步
      </van-button>
    </div>
    <TimePicker
      ref="timePickerRef"
      v-model="currentTime"
      title="添加时间"
      :columns-type="columsType"
      @confirm="onTimeConfirm"
    />
  </div>
</template>
