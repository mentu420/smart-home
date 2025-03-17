<script setup>
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DateRepeatSheet from '@/components/common/DateRepeatSheet.vue'
import TimePicker from '@/components/common/TimePicker.vue'
import smartStore from '@/store/smartStore'

defineOptions({ name: 'SmartCondtionTime' })

const { createSmartItem } = storeToRefs(smartStore())

const router = useRouter()
const route = useRoute()
const columsType = ref(['hour', 'minute'])
const currentTime = ref(dayjs().format('HH:ss').split(':'))
const conditionTimeList = ref([])
const timePickerRef = ref(null)
const timeRangeType = ref(0) //0 全天 1 时间范围
const timeRange = ref([])

const timeRepeat = ref({})

const onTimeConfirm = ({ selectedValues }, scopeData) => {
  if (!scopeData) {
    conditionTimeList.value.push(selectedValues)
  } else {
    conditionTimeList.value = conditionTimeList.value.map((item, i) => {
      if (i == scopeData.index) return selectedValues
      return item
    })
  }

  timePickerRef.value.close()
}

const delTimeItem = (i) => {
  conditionTimeList.value = conditionTimeList.value.filter((item, index) => index != i)
}

const onSave = () => {
  const { events = [] } = createSmartItem.value
  const { type = 3, value = [-1] } = timeRepeat.value
  //时间列表
  const timeList = conditionTimeList.value.map((timeItem) => ({
    leixing: 1,
    tiaojian: {
      shijian: timeItem.join(':'),
      chongfuleixing: type,
      chongfuzhi: value,
    },
  }))
  const { eventIndex } = route.query
  if (eventIndex) {
    createSmartItem.value = {
      ...createSmartItem.value,
      events: events.map((item, i) => {
        const { fujiatiaojian = [] } = item
        if (eventIndex == i) {
          return {
            ...item,
            fujiatiaojian: [...fujiatiaojian, ...timeList],
          }
        }
        return item
      }),
    }
  } else {
    createSmartItem.value = {
      ...createSmartItem.value,
      events: [...events, ...timeList],
    }
  }

  router.goBack(-2)
}

const addTime = () => {
  if (conditionTimeList.value.length > 0) return
  timePickerRef.value?.open()
}
</script>

<template>
  <div class="min-h-screen bg-page-gray">
    <HeaderNavbar title="时间日期" />
    <section class="space-y-4 p-4">
      <template v-if="!route.query.extend">
        <van-cell class="rounded-lg" title="添加时间" is-link @click="addTime" />
        <van-swipe-cell
          v-for="(timeItem, timeIndex) in conditionTimeList"
          :key="timeIndex"
          class="overflow-hidden rounded-lg"
        >
          <van-cell
            :border="false"
            title="指定时间"
            :value="timeItem.join(':')"
            @click="timePickerRef.open({ index: timeIndex, modelValue: timeItem })"
          />
          <template #right>
            <van-button square type="danger" text="删除" @click="delTimeItem(timeIndex)" />
          </template>
        </van-swipe-cell>
      </template>
      <div class="rounded-lg overflow-hidden">
        <van-radio-group v-model="timeRangeType">
          <van-cell
            v-for="(typeItem, typeIndex) in ['全天有效', '部分时段生效']"
            :key="typeIndex"
            :title="typeItem"
            clickable
            @click="timeRangeType = typeIndex"
          >
            <template #right-icon>
              <van-radio :name="typeIndex" />
            </template>
          </van-cell>
        </van-radio-group>
        <div class="pl-4 bg-white">
          <van-cell
            v-for="(rangeItem, rangeIndex) in ['开始', '结束']"
            :key="rangeIndex"
            :title="rangeItem"
            is-link
            clickable
          >
          </van-cell>
        </div>
      </div>
      <DateRepeatSheet v-model="timeRepeat" />
    </section>
    <div class="p-6">
      <van-button block round :disabled="conditionTimeList.length == 0" @click="onSave">
        下一步
      </van-button>
    </div>
    <TimePicker
      ref="timePickerRef"
      v-model="currentTime"
      title="添加时间"
      :columns-type="columsType"
      @select="onTimeConfirm"
    />
  </div>
</template>
